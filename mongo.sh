#!/bin/sh
#db.users.update({ "_id" : "onj9p4GSciL3rb3jF"}, {$set: {"profile.isAdmin": true}})
ssh tickets docker run -it --rm --link docker_ticketsmongo_1:mongo mongo:2.6 sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/tickets"'

