#!/usr/bin/env python3
import sys
import socket

# credits for majority of code from Securing software course of MOOC
# and rest of the credits to chat gpt! :P

def get_accessible_ports(address, min_port, max_port):
    found_ports = []

    for port in range(min_port, max_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)  # Set a timeout for the connection attempt
            result = sock.connect_ex((address, port))
            if result == 0:
                found_ports.append(port)
    
    return found_ports

def main(argv):
    address = sys.argv[1]
    min_port = int(sys.argv[2])
    max_port = int(sys.argv[3])
    ports = get_accessible_ports(address, min_port, max_port)
    for p in ports:
        print(p)

# This makes sure the main function is not called immediately
# when TMC imports this module
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print('usage: python %s address min_port max_port' % sys.argv[0])
    else:
        main(sys.argv)
