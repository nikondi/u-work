import {useEffect} from "react";

export function useEcho(channel, event, onMessage) {
    useEffect(() => {
        if (channel !== '')
            window.Echo.channel(channel).listen(event, onMessage);

        return () => {
            if (channel === '') return;

            /*
            This is absolutely needed due to callbacks not being unbinded on leave.
            If we don't use "stopListening()" and just use "leave()" it will not unbind the callback resulting in double calls.
            https://github.com/pusher/pusher-js/issues/273#issuecomment-692803569
             */
            const echoChannel = window.Echo.channel(channel)
            echoChannel.stopListening(event)

            window.Echo.leave(channel)
        }
    }, [channel, event, onMessage])
}
