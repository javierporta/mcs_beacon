#!/usr/bin/env python
#
# Copyright 2015 Opera Software ASA. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""
Advertises a url as an Eddystone beacon.
"""
import os
import sys
import subprocess
import argparse

if (sys.version_info > (3, 0)):
    DEVNULL = subprocess.DEVNULL
else:
    DEVNULL = open(os.devnull, 'wb')
# The default url
url = "https://github.com/me"
advInterval = "l"  # low by default

parser = argparse.ArgumentParser(prog='advertise-url', description=__doc__)
parser.add_argument("-u", "--url", nargs='?', const=url, type=str,
                    default=url, help='URL to advertise.')

parser.add_argument('-s', '--stop', action='store_true',
                    help='Stop advertising url.')

parser.add_argument("-v", "--verbose", action='store_true',
                    help='Print lots of debug output.')

parser.add_argument("-t", "--time", nargs='?', const=advInterval, type=str,
                    default=advInterval, help='Set adverstising time. Values are "l"ow (100ms) or "h"igh (1000ms)')

options = parser.parse_args()

url = options.url
advInterval = options.time

schemes = [
    "http://www.",
    "https://www.",
    "http://",
    "https://",
]

extensions = [
    ".com/", ".org/", ".edu/", ".net/", ".info/", ".biz/", ".gov/",
    ".com", ".org", ".edu", ".net", ".info", ".biz", ".gov",
]


def verboseOutput(text=""):
    if options.verbose:
        sys.stderr.write(text + "\n")


def encodeurl(url):
    i = 0
    data = []

    for s in range(len(schemes)):
        scheme = schemes[s]
        if url.startswith(scheme):
            data.append(s)
            i += len(scheme)
            break
    else:
        raise Exception("Invalid url scheme")

    while i < len(url):
        if url[i] == '.':
            for e in range(len(extensions)):
                expansion = extensions[e]
                if url.startswith(expansion, i):
                    data.append(e)
                    i += len(expansion)
                    break
            else:
                data.append(0x2E)
                i += 1
        else:
            data.append(ord(url[i]))
            i += 1

    return data


def encodeMessage(url):
    encodedurl = encodeurl(url)
    encodedurlLength = len(encodedurl)

    verboseOutput("Encoded url length: " + str(encodedurlLength))

    if encodedurlLength > 18:
        raise Exception("Encoded url too long (max 18 bytes)")

    message = [
        0x02,   # Flags length
        0x01,   # Flags data type value
        0x1a,   # Flags data

        0x03,   # Service UUID length
        0x03,   # Service UUID data type value
        0xaa,   # 16-bit Eddystone UUID
        0xfe,   # 16-bit Eddystone UUID

        5 + len(encodedurl),  # Service Data length
        0x16,   # Service Data data type value
        0xaa,   # 16-bit Eddystone UUID
        0xfe,   # 16-bit Eddystone UUID

        0x10,   # Eddystone-url frame type
        0xed,   # txpower
    ]

    message += encodedurl

    return message


def advertise(url):
    ### BEGIN EDDYSTONE ###
    print("Advertising: " + url)
    verboseOutput("Advertising: " + url)
    message = encodeMessage(url)

    # Prepend the length of the whole message
    message.insert(0, len(message))

    # Pad message to 32 bytes for hcitool
    while len(message) < 32:
        message.append(0x00)

    # Make a list of hex strings from the list of numbers
    message = map(lambda x: "%02x" % x, message)

    # Concatenate all the hex strings, separated by spaces
    message = " ".join(message)
    verboseOutput("Message: " + message)

    subprocess.call("sudo hciconfig hci0 up", shell=True, stdout=DEVNULL)

    # Stop advertising
    subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x000a 00",
                    shell=True, stdout=DEVNULL)

    # Set message
    subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x0008 " +
                    message, shell=True, stdout=DEVNULL)

    # LE Set Advertising Parameters. MIn and max will never be the same
    # The Advertising_Interval_Min shall be less than or equal to the Advertising_Interval_Max.
    #  The Advertising_Interval_Min and Advertising_Interval_Max should not be the same value to enable the Controller
    #  to determine the best advertising interval given other activities.
    # Time = N * 0.625ms
    # fifht byte means connectable mode (03)

    if advInterval == "h":
        # high interval time
        print("Adv time = 1000ms - 1200ms")
        subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x0006 06 40 07 80 03 00 00 00 00 00 00 00 00 07 00",
                        shell=True, stdout=DEVNULL)
    else:
        # low interval time
        print("Adv time = 100ms - 200ms")
        subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x0006 A0 00 01 40 03 00 00 00 00 00 00 00 00 07 00",
                        shell=True, stdout=DEVNULL)

    # Resume advertising
    subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x000a 01",
                    shell=True, stdout=DEVNULL)

    ### END EDDYSTONE ###


def stopAdvertising():
    print("Stopping advertising")
    verboseOutput("Stopping advertising")
    subprocess.call("sudo hcitool -i hci0 cmd 0x08 0x000a 00",
                    shell=True, stdout=DEVNULL)


try:
    if options.stop:
        stopAdvertising()
    else:
        advertise(url)
except Exception as e:
    sys.stderr.write("Exception: " + str(e) + "\n")
    exit(1)
