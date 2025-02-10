import {useEffect, useRef} from 'react';
import {EasyOCR}  from 'node-easyocr';

const CameraStream: React.FC<{ onResult: (result: string) => void }> = ({ onResult }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ocr = new EasyOCR();

    useEffect(() => {
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
            const ocrResults = await ocr.readText(dataUrl);
            const resultText = ocrResults.map(res => res.text).join(' ');
            onResult(resultText);
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