import { Prisma, PrismaClient } from "@prisma/client";
import { group, log } from "node:console";
import { createUser } from "./services/user-service";


type Message = {
  pseudo: string;
  message: string
}

const db = new PrismaClient()

const routes = [
  {
    method: "POST",
    url: "/save-user",
    pattern: /^\/save-user\/?$/,
    handle: async (req: Request) => {
      const payload = await req.json()
      const {username} = payload

      const newUser = await createUser(username as string) 
      if(!newUser){
        return createResponse({
          errorMessage: "Cet utilisateur existe déjà.",
        }, 400)
      }
      return createResponse(newUser)
    }
  },
  {
    method: "GET",
    url: "/users",
    pattern: /^\/users\/?$/,
    handle: async (req: Request) => {
      const users = await db.user.findMany();
      return createResponse(users)
    }
  },
  {
    method: "GET",
    url: "/groups/{groupdId}",
    pattern: /^\/group\/(\d+)\/?$/,
    handle: async (req: Request) => {
      const request = validateRouteWithParams({method: "GET", url: req.url, routePattern: /^\/group\/(\d+)\/?$/})
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
      return createResponse(group)
    }  
  },
  {
    method: "GET",
    url: "/group/{groupdId}/messages",
    pattern: /^\/group\/(\d+)\/messages\/?$/,
    handle: async (req: Request) => {
      const request = validateRouteWithParams({method: "GET", url: req.url, routePattern: /^\/group\/(\d+)\/messages\/?$/})
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
    }  
  },
  {
    method: "GET",
    url: "/users/{userId}/groups",
    pattern: /^\/users\/(\d+)\/groups\/?$/,
    handle: async (req: Request) => {

     const userId = getParamInUrl(req.url, /^\/users\/(\d+)\/groups\/?$/)
      console.log({userId});
      
      const user = await db.user.findFirst({
        where: {
          id: Number(userId)
        }
      });

      if(!user){
        return createResponse({
          errorMessage: "Utilisateur non trouvé.",
        }, 400)
      }

      const users = await db.group.findMany({
        where: {
          users: {
            some: {
              id: Number(userId)
            }
          }
        },
    
      });
      return createResponse(users)
    }  
  },
  {
    method: "POST",
    url: "/send-message",
    pattern: /^\/send-message\/?$/,
    handle: async (req: Request) => {
      const payload = await req.json()
      const {groupId , message, from} = payload

      const updatedGroup = await db.group.update({
        where: {
          id: groupId as number
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
      return createResponse(updatedGroup)
    }
  },
  {
    method: "POST",
    url: "/create-group",
    pattern: /^\/create-group\/?$/,
    handle: async (req: Request) => {
      const payload = await req.json()
      const {usersId } = payload

      const groupExist = await db.group.findFirst({
        where: {
          users: {
            every: {
              id: {
                in: usersId
              }
            }
          }
        },
        include: {
          users: true
        }
      })

      if(groupExist){
        return createResponse(groupExist)
      }

      const newGroup = await db.group.create({
        data: {
          users: {
            connect: usersId.map((id: number) => ({id}))
          }
        },
        include: {
          users: true
        }
      })
      
      return createResponse(newGroup)
    }
  }
]

const server = Bun.serve<{ pathname: string }>({
  
  async fetch(req, server) {
    const { pathname } = new URL(req.url);
    console.log(pathname);
    console.log(validateRouteWithParams({method: "POST", url: pathname.trim(), routePattern: /^\/send-message\/?$/}));
    
    for (const route of routes) {
      if (req.method === route.method && route.pattern.test(pathname)) {
        return route.handle(req);
      }
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

const createResponse = <T>(data: T, statusCode = 200) => {
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

const getParamInUrl = (url: string, pattern: RegExp): string | null => {
  const { pathname } = new URL(url, "http://localhost");
  const match = pathname.match(pattern);
  console.log({match});
  
  return match ? match[1] : null;
}


console.log(`Listening on ${server.hostname}:${server.port}`);