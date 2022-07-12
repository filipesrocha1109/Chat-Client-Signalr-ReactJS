import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";

export default function App (){
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [containsName, setContainsName] = useState(false);
    const [chat, setChat] = useState<PersonMessage[]>([]);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
        .withUrl("https://localhost:7106/chat")
        .withAutomaticReconnect()
        .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
    if (connection) {
        connection
        .start()
        .then(() => {
            connection.on("SendMsgResp", (response) => {
                setChat(oldArray => [...oldArray, response]);
            });
        })
        .catch((error) => console.log(error));
    }
    }, [connection]);

    type PersonMessage = {
        name: string;
        message: string;
    };



    const sendMessage = async () => {
        if (connection){
            var objSend : PersonMessage = {
                name : name,
                message : message
            }  
            
            await connection.send("SendMsg", objSend, connection.connectionId);
            
            setMessage("");

        }else{
            alert('connection lost')
        }
    };

    const SetName = () =>{
        setContainsName(true);
    }

  return (
    <>
      {!containsName? 
        <div>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder = "Name"
            />
            <button onClick={SetName}>
                Submit
            </button>
        </div>
      :
        <div>
            <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder = "Message"
            />              
            <button 
                onClick={sendMessage}>
                Send
            </button>
            
            <hr/>
            
            {chat.map
                (m => 
                    <div>{m.name} : {m.message}</div>
                )
            }        
        </div>
      }


      

      
    </>
  );
};