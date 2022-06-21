interface ServerToClientEvents {
    'users:add': (data: string) => void;
    'users:remove': (data: string) => void;
    'users:set': (data: string[]) => void;
    'invite:sent': (data: any) => void;
    'invite:accept': (data: any) => void;
    'invite:cancel': (data: any) => void;
    'invite:recive': (data: any) => void;
    'invite:random': () => void;
    'move:sent': (data: any) => void;
    'move:recive': (data: any) => void;
    'messages:sent': (data: any) => void;
    'messages:recive': (data: any) => void;
    'game:invite': (data: any) => void;
    'game:start': (data: any) => void;
    'game:step': (data: any) => void;
    'game:cancel': (data: any) => void;
}

interface ClientToServerEvents {
    'users:add': (data: string) => void;
    'users:remove': (data: string) => void;
    'users:set': (data: string[]) => void;
    'invite:sent': (data: any) => void;
    'invite:accept': (data: any) => void;
    'invite:cancel': (data: any) => void;
    'invite:recive': (data: any) => void;
    'invite:random': () => void;
    'move:sent': (data: any) => void;
    'move:recive': (data: any) => void;
    'messages:sent': (data: any) => void;
    'messages:recive': (data: any) => void;
}
