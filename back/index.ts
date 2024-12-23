import { Prisma, PrismaClient } from "@prisma/client";
import { log } from "node:console";


type Message = {
  pseudo: string;
  message: string
}

const db = new PrismaClient()
const server = Bun.serve<{ pathname: string }>({
  
  async fetch(req, server) {
    const { pathname } = new URL(req.url);
    console.log(pathname);
    console.log(validateRouteWithParams({method: "POST", url: pathname.trim(), routePattern: /^\/send-message\/?$/}));
    
    if(req.method === "POST" && pathname === "/save-user"){

      const payload = await req.json()
      const {username} = payload
      const newUser = await db.user.create({
        data: {
          name: username
        }
      })
      const res =  new Response(JSON.stringify(newUser))
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      return res;

    } else if(req.method === "GET" && pathname === "/userss"){
      const users = await db.user.findMany();
      return createResponse(users)
    } else if(validateRouteWithParams({method: "GET", url: pathname, routePattern: /^\/group\/(\d+)\/messages$/}).isValid)
    {
      const request = validateRouteWithParams({method: "GET", url: pathname, routePattern: /^\/group\/(\d+)\/messages$/})
      console.log("messages");
      
      if(!request.groupId){
        return createResponse({
          errorMessage: "Impossible.",
        }, 400)
      }

      const group = await db.group.findFirst({
        where: {
          id: Number(request.groupId)
        },
        include:{
          messages: true
        }
      });
      return createResponse(group?.messages)
    } else if(req.method === "POST" && pathname === "/send-message") {
        console.log("send message");

        const request = validateRouteWithParams({method: "GET", url: pathname, routePattern: /^\/user\/(\d+)\/messages$/})
    
        const payload = await req.json()
        const {groupId , message} = payload
 
        const test = await db.group.update({
          where: {
            id: groupId
          },
          data: {
            messages: {
              create: [
                {
                  message: message as string,
                  userId: 25
                }
              ]
            }
          }
        })
      
        return createResponse({test}, 201)
        // const updatedGroup = await db.group.update({
        //   where: {
        //     id: groupId as number
        //   },
        //   data: {
        //     messages: {
        //       create: [
        //         {
        //           message: message as string,
        //           userId: 25
        //         }
        //       ]
        //     }
        //   }
        // })
      }

  


    
    const success = server.upgrade(req, { data: { pathname } });
     
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds 
      return undefined;
    }

    // handle HTTP request normally
    const res =  new Response("Hello world!");
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return res
  },
  websocket: {
    async open(ws) {
    
      const msg = `${ws.data.pathname} has entered the chat`;
    
      if(ws.data.pathname === "/users"){
        ws.subscribe("users");
      }

      if(ws.data.pathname === "/chat"){
        ws.subscribe("chat");
      }
    },
    // this is called when a message is received
    async message(ws, message) {
      
      // send back a message
      // const dataFromFront: Message = JSON.parse(message.toString())

      // messages = [...messages, dataFromFront]
   
      if(ws.data.pathname === "/users"){
    
        const users = await db.user.findMany()
        server.publish("users", JSON.stringify(users));
      }

      if(ws.data.pathname === "/chat"){
    
        const group = await db.group.findFirst({
          where:{
            id: 2
          },
          include: {
            messages: true
          }
          
        })
        server.publish("chat", JSON.stringify(group?.messages));
      }

     
    },
  },
});

const createResponse = <T>(data: T, statusCode: number = 200) => {
  const res =  new Response(JSON.stringify(data), {
    status: statusCode
  });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  return res
}

type ValidationResult = {
  isValid: boolean;
  groupId?: string;
  error?: string;
};

const validateRouteWithParams = (req: { method: string; url: string, routePattern: RegExp }): ValidationResult => {
  const { method, url, routePattern } = req;

  if (method !== "GET") {
    return { isValid: false, error: "Méthode non autorisée." };
  }

  const { pathname } = new URL(url, "http://localhost");

  const match = pathname.match(routePattern);

  
  if (!match) {
    return { isValid: false, error: "Chemin invalide ou non trouvé." };
  }
  const groupId = match[1];
  // Extraire les paramètres capturés
  // const params = match.groups || {};
  // console.log({params});
  return { isValid: true, groupId };
};


console.log(`Listening on ${server.hostname}:${server.port}`);