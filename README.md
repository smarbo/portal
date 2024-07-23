# PortalOS
PortalOS is a web-based operating system being developed to fulfill a larger vision - 
being able to build powerful software from anywhere with a screen, a keyboard, and an internet connection.
Currently, it is a simple browser interface with support for web apps using an iframe browser and HTML apps.

# The Vision.
My vision is to create a frontend web interface which can connect to a lightweight server, which will run on any capable device, allowing you to use the browser
interface as an abstraction layer for a simple and easy-to-learn user interface.

# PortalSRV
PortalSRV will be a lightweight server which allows the browser interface of PortalOS to connect to and manage to the (linux) server/PC of your choice.
Setup will be designed to be easy and fast, so that you can get it up and running within seconds. After setup, the installer will create a service which
runs on system startup, to start your Portal server. This server will be a socket server which manages your system through a connection from PortalOS.
The capabilites of this server will be:
- File management
- Terminal access
- Text editing
