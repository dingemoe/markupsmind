import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';

export default function MarkmapHooks() {
  const [value, setValue] = useState('');
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket('wss://websocket-mindmap.glitch.me/');
      ws.onmessage = (event) => {
        let text = event.data.toString();
        setValue(text);
      };

      ws.onclose = () => {
        console.log(
          'WebSocket closed. Reconnect will be attempted in 1 second.'
        );
        setTimeout(connect, 1000);
      };

      ws.onerror = (err) => {
        console.error(
          'WebSocket encountered error:',
          err.message,
          'Closing socket'
        );
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (refSvg.current) {
      requestAnimationFrame(() => {
        const rect = refSvg.current.getBoundingClientRect();
        if (rect.width && rect.height) {
          if (!refMm.current) {
            const mm = Markmap.create(refSvg.current);
            refMm.current = mm;
          }

          if (refMm.current) {
            const { root } = transformer.transform(value);
            refMm.current.setData(root);
            refMm.current.fit();
          }
        }
      });
    }
  }, [value, refSvg.current]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="flex-1">
        <textarea
          className="w-full h-full border border-gray-400"
          value={value}
          onChange={handleChange}
        />
      </div>
      <svg className="flex-1" ref={refSvg} />
    </React.Fragment>
  );
}
