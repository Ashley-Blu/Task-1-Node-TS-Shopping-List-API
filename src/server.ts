import http, { IncomingMessage, ServerResponse } from 'http';
import { listsRoute } from './routes/List'

const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    if(req.url?.startsWith('/lists')) {
        listsRoute(req, res);
    }else{
        res.writeHead(200, {"content-type": "applicatio/json"});
        res.end(JSON.stringify({message: "Hello world!"}));
    }
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});