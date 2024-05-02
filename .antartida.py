#!/usr/bin/env python3
# Glaide Lara & ovidio j S Junior 
# Servidor TCP implementado com cache 
# codigo fonte Servidor Antartida

import socket
import random

HOST = 'localhost'
PORTA = 5002
msg_r= 'reflesh'
#busca um número aleatório de -20 a 10
Temp_ficticia = random.randint(-20,10)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORTA))
s.listen()

print('Aguardando conexão com o cliente.../n')
while True:
# conexão e endereco
    con, cliente = s.accept()
    print('Conectado por', cliente)
    while True:
        print('Aguardando requisição...\n')
        msg = con.recv(1024)
        if not msg: break
        if msg.decode() == msg_r:
            con.send(str(Temp_ficticia).encode())
            Temp_ficticia = random.randint(-20,10)
