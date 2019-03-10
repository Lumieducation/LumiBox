# Lumi Box

Proof of Concept for using a Raspberry Pi 3 B as an access point and server enabling teachers to install and run several educational tools.

This project is highly experimental and should not be used in production.


## Tools

### File Structure

	|-package               // content of the tar file
	| |-tool
	| | |-meta.json
	| | |-install.sh
	| | |-remove.sh
	| | |-start.sh
	| | |-stop.sh
	| | '-status.sh			// should echo `0` if tool is not running
	| |
	| '-...
	|
	|-package<target>       // target-specific content of the tar file
	| '-...
	|
	'-src					// files used for image-building
	  '-...


### meta.json

	{
	  "name": "foo"
    }
	
### Building and Packing

Make sure the scripts are executable

	$ chmod +x box/pack.sh box/build_image.sh

Build and store the Docker image

	$ ./build_image.sh <tool folder> [<target>]

Create a compressed tar file that can be installed on box

	$ ./pack.sh <tool folder> [<target>]
	
#### Example
	
	$ ./pack.sh box/tools/example

	$ ./build_image.sh box/tools/hello _x86
	
	$ ./pack.sh box/tools/hello _x86


## Installation

For this installation, the RaspberryPi needs to have internet access over the Ethernet port.

### General set-up

#### Update system

	$ sudo apt-get update
	$ sudo apt-get upgrade

#### Reduce GPU memory

	$ sudo nano /boot/config.txt
	
Add the line

	gpu_mem=16

#### Install needed programs

	$ sudo apt-get install curl git wget


### Lumi Box Web Application

#### Download and install web application

    $ mkdir /lumi && cd /lumi
    $ git clone https://github.com/Lumieducation/box.git
    $ cd box
    $ npm install

#### Install and start nginx

	$ sudo apt-get install nginx
	$ sudo /etc/init.d/nginx start
	
#### Increase server name bucket size
	
	$ sudo /etc/nginx/nginx.conf
	
Uncomment the line that contains
	
	server_names_hash_bucket_size  64;
	
#### Virtual Host

	$ sudo nano /etc/nginx/conf.d/default.conf
	
	server {
	  listen 80;
	  server_name on.lumi.education;

	  location / {
		proxy_pass_header Authorization;
		proxy_pass http://localhost:4200;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_http_version 1.1;
		proxy_set_header Connection "";
		proxy_buffering off;
		client_max_body_size 0;
		proxy_read_timeout 36000s;
		proxy_redirect off;
	  }
	}

#### Auto-start

	$ sudo nano /etc/systemd/system/lumi_box.service
	
	[Unit]
	Description=lumi_box
	After=network.target

	[Service]
	ExecStart=/usr/bin/node server.js
	Restart=always
	User=root
	Group=root
	Environment=PATH=/bin:/usr/bin:/usr/local/bin
	WorkingDirectory=/lumi/box/

	[Install]
	WantedBy=multi-user.target
	
	$ sudo systemctl enable lumi_box


### Docker
 
#### Install

	$ curl -sSL https://get.docker.com | sh

#### Autostart

	$ sudo systemctl enable docker
	$ sudo systemctl start docker
	
#### Add pi to docker group

	$ sudo usermod -aG docker $USER
	$ newgrp docker
	


### Access Point

#### Install

	$ sudo apt-get install dnsmasq hostapd
	$ sudo systemctl stop dnsmasq && sudo systemctl stop hostapd
	
	$ sudo reboot
	
#### Static IP Address
	
	$ sudo nano /etc/dhcpcd.conf
	
	interface wlan0
        static ip_address=192.168.4.1/24
        nohook wpa_supplicant
		
	$ sudo systemctl daemon-reload && sudo service dhcpcd restart
	
#### DHCP Server

	$ sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
	$ sudo nano /etc/dnsmasq.conf
	
Insert the lines
	
	interface=wlan0
	  dhcp-range=192.168.4.2,192.168.4.42,255.255.255.0,24h
	  
	address=/on.lumi.education/192.168.4.1
	address=/.on.lumi.education/192.168.4.1
	  
#### Access Point

	$ sudo nano /etc/hostapd/hostapd.conf

	interface=wlan0
	driver=nl80211
	ssid=Lumi_WLAN
	hw_mode=g
	channel=7
	wmm_enabled=0
	macaddr_acl=0
	auth_algs=1
	ignore_broadcast_ssid=0
	wpa=2
	wpa_passphrase=lumieducation
	wpa_key_mgmt=WPA-PSK
	wpa_pairwise=TKIP
	rsn_pairwise=CCMP
	
	$ sudo nano /etc/default/hostapd
	
	DAEMON_CONF="/etc/hostapd/hostapd.conf"
	
#### Auto-start

	$ sudo systemctl start hostapd
	$ sudo systemctl start dnsmasq
	$ sudo reboot
	
	
### Captive Portal

#### Rewrite DNS

    $ sudo nano /etc/dnsmasq.conf
    
Add these lines

    address=/clients3.google.com/192.168.4.1
    address=/clients.l.google.com/192.168.4.1
    address=/connectivitycheck.android.com/192.168.4.1
    address=/connectivitycheck.gstatic.com/192.168.4.1
    address=/play.googleapis.com/192.168.4.1

    address=/apple.com/192.168.4.1
    address=/captive.apple.com/192.168.4.1
    
    address=/msftncsi.com/192.168.4.1
    address=/.msftncsi.com/192.168.4.1
    address=/msftconnecttest.com/192.168.4.1
    address=/.msftconnecttest.com/192.168.4.1
    
#### Redirect to Captive Portal

    $ sudo nano /etc/nginx/conf.d/captive_portal.conf
    
    server {
        server_name
            clients3.google.com
            clients.l.google.com
            connectivitycheck.android.com
            connectivitycheck.gstatic.com
            play.googleapis.com;
        listen 80;
    
        location / {
            return 444;
        }
    
        location /generate_204 {
            rewrite ^(.*) http://on.lumi.education/captive_portal redirect;
        }
    }
    
    server {
        server_name
            apple.com
            captive.apple.com
            msftncsi.com
            www.msftncsi.com
            dns.msftncsi.com
            ipv6.msftncsi.com
            msftconnecttest.com
            www.msftconnecttest.com
            ipv6.msftconnecttest.com;
        listen 80;
    
        location / {
            rewrite ^(.*) http://on.lumi.education/captive_portal redirect;
        }
    }

#### Restart Services

    $ sudo /etc/init.d/dnsmasq restart
    $ sudo /etc/init.d/nginx restart