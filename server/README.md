# Lumi Box Server

## Installation

### Lumi Box Web Application

#### Download and install web application

	$ mkdir /lumi && cd /lumi
	$ sudo apt-get install git
	$ git clone https://github.com/Lumieducation/LumiBox.git box
	$ cd box
	$ npm install

#### Install and start nginx

	$ sudo apt-get install nginx
	$ sudo /etc/init.d/nginx start
	
#### Increase server name bucket size
	
	$ sudo /etc/nginx/nginx.conf
	
Un-comment the line that contains
	
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
	ExecStart=/usr/bin/node src/server.js
	Restart=always
	User=root
	Group=root
	Environment=PATH=/bin:/usr/bin:/usr/local/bin
	WorkingDirectory=/lumi/box/server/

	[Install]
	WantedBy=multi-user.target
	
	$ sudo systemctl enable lumi_box


### Docker
 
#### Install

	$ sudo apt-get install curl
	$ curl -sSL https://get.docker.com | sh

#### Autostart

	$ sudo systemctl enable docker
	$ sudo systemctl start docker
	
#### Add pi to docker group

	$ sudo usermod -aG docker $USER
	$ newgrp docker


### Captive Portal
    
#### Redirect any request to Pi's IP

    $ sudo iptables -t nat -A PREROUTING -p tcp -m tcp -s 192.168.4.0/24 --dport 80 -j DNAT --to-destination 192.168.4.1
    $ sudo iptables -t nat -A POSTROUTING -j MASQUERADE
    
#### Apply rules on boot
    
    $ sudo bash -c 'iptables-save > /etc/network/iptables'
    
    $ sudo nano /etc/rc.local
    
Add this line before `exit 0`
    
    iptables-restore /etc/network/iptables
    
#### Redirect any URL Captive Portal

    $ sudo nano /etc/nginx/conf.d/captive_portal.conf
    
    server {
        listen 80 default_server;
    
        location / {
            rewrite ^(.*) http://on.lumi.education/captive_portal redirect;
        }
    }
    
Restart nginx

    $ sudo /etc/init.d/nginx restart