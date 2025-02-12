import {useEffect, useRef} from 'react';
import Tesseract  from 'tesseract.js';

const CameraStream: React.FC<{ onResult: (result: string) => void }> = ({ onResult }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            });

        const interval = setInterval(async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            const dataUrl = canvas.toDataURL('image/png');
            Tesseract.recognize(
                dataUrl, 
                'eng+fra+swe+spa+deu+ita+nld+por', 
                {
                    logger: (m) => console.log(m), 
                }
            ).then(({ data: { text } }) => {
                if (text) {
                    onResult(text);
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            if (video.srcObject) {
                const stream = video.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onResult]);

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-96 h-72" style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="hidden" width={640} height={480} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraStream;