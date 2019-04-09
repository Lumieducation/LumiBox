# Lumi Box

This repository contains a collection of instructions and software for using a Raspberry Pi 3 B as an access point and a web application enabling teachers to install and run digital tools.

## Installation

For this installation, the RaspberryPi needs to have internet access over the Ethernet port.

1. [Set the Raspberry Pi up as a WiFi access point](access_point_setup.md)
2. [Install the server and captive portal](server/README.md)

## Usage

Turn on the Pi and wait search for the WiFi network `LumiLand`. Connect to it using the password `education`. When connected, your device should open the "login" page with a link to the web application. Open that link in a regular browser (by using the top-right menu or clipboard). If the "login" page does not open automatically, open a browser and enter `on.lumi.education` in the address bar.

Don't forget to shutdown the Pi before turning it off to not destroy its hard drive.

## Tools

This software is currently under development and we do not yet have any packaged tools to be installed.