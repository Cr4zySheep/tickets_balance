#!/bin/bash
~/.meteor/meteor build --server=tickets.coworking-metz.fr --architecture=os.linux.x86_64 bundle
scp -r bundle/ tickets:docker/tickets/
ssh tickets 'cd docker; docker-compose restart tickets'
