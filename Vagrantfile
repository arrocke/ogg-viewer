# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.network "forwarded_port", guest: 8080, host: 9000

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
    bash nodesource_setup.sh
    apt-get install nodejs build-essential -y
  SHELL
end
