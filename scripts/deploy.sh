#!/usr/bin/expect
#set timeout 20 #设置超时时间
#部署项目
spawn ssh root@xxx.xxx.xx.x
expect "Welcome"
send "cd /data/\r"
send "\r"
expect "done"
send "git pull && cnpm i && cnpm run build:dev\r"
# send "exit\r"
interact