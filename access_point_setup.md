# Lumi Box Access Point Setup

The following instructions turn a Raspberry Pi 3 with a clean [Raspbian Stretch Lite](https://www.raspberrypi.org/downloads/raspbian/) system into a WiFi access point.

## General set-up

### Update system

	$ sudo apt-get update
	$ sudo apt-get upgrade

### Reduce GPU memory

	$ sudo nano /boot/config.txt
	
Add the line

	gpu_mem=16


## Access Point

### Install dnsmasq & hostapd

	$ sudo apt-get install dnsmasq hostapd
	$ sudo systemctl stop dnsmasq && sudo systemctl stop hostapd
	
	$ sudo reboot
	
### Static IP Address
	
	$ sudo nano /etc/dhcpcd.conf
	
	interface wlan0
        static ip_address=192.168.4.1/24
        nohook wpa_supplicant
		
	$ sudo systemctl daemon-reload && sudo service dhcpcd restart
	
### DHCP Server

	$ sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
	$ sudo nano /etc/dnsmasq.conf
	
Insert the lines
	
	interface=wlan0
	  dhcp-range=192.168.4.2,192.168.4.42,255.255.255.0,24h
	  
	address=/on.lumi.education/192.168.4.1
	address=/.on.lumi.education/192.168.4.1
	  
### Access Point

	$ sudo nano /etc/hostapd/hostapd.conf

	interface=wlan0
	driver=nl80211
	ssid=LumiLand
	hw_mode=g
	channel=7
	wmm_enabled=0
	macaddr_acl=0
	auth_algs=1
	ignore_broadcast_ssid=0
	wpa=2
	wpa_passphrase=education
	wpa_key_mgmt=WPA-PSK
	wpa_pairwise=TKIP
	rsn_pairwise=CCMP
	
	$ sudo nano /etc/default/hostapd
	
	DAEMON_CONF="/etc/hostapd/hostapd.conf"
	
### Auto-start

	$ sudo systemctl start hostapd
	$ sudo systemctl start dnsmasq
	$ sudo reboot