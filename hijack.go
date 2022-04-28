// Hijacks a drone mid-air, performs some acrobatics, and lands

package main

import (
    "time"
    "net"
    "log"
    "gobot.io/x/gobot/platforms/dji/tello"
)

func main() {
    // Send 'command' to take over
    con, err := net.Dial("udp", "192.168.10.1:8889")
    checkErr(err)
    defer con.Close()
    _, err = con.Write([]byte("command"))
    checkErr(err)
    reply := make([]byte, 1024)
    _, err = con.Read(reply)
    checkErr(err)

    drone := tello.NewDriver("8888")

    drone.Start()

    time.Sleep(2*time.Second)
    
    drone.LeftFlip()

    time.Sleep(5*time.Second)
    
    drone.RightFlip()

    time.Sleep(5*time.Second)
    
    drone.Land()
}

func checkErr(err error) {

    if err != nil {

        log.Fatal(err)
    }
}