
document.addEventListener('DOMContentLoaded', ()=>{


    const CANVAS = document.getElementById('video');
    const CTX = CANVAS.getContext('2d');
    const COLOR = [144,54,46];
    const THRESHOLD = 50;
    let VIDEO;

    const distance = ( v1, v2 ) => {
            return Math.sqrt((v1[0]-v2[0])*(v1[0]-v2[0])+
            (v1[1]-v2[1])*(v1[1]-v2[1])+
            (v1[2]-v2[2])*(v1[2]-v2[2]))
    }

    navigator.mediaDevices.getUserMedia({video:true})
        .then((rawData)=>{
            VIDEO = document.createElement('video');
            VIDEO.srcObject=rawData;
            VIDEO.play();
            VIDEO.onloadeddata = animatedTourchEffect;
        }).catch((err)=>{
            console.log(err);
        })

    const animatedTourchEffect = ()=>{
        CANVAS.width = VIDEO.videoWidth;
        CANVAS.height = VIDEO.videoHeight;
        CTX.drawImage(VIDEO, 0, 0, CANVAS.width, CANVAS.height );

        const {data} = CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
        const locs = [];

        for(let i = 0; i<data.length; i+=4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];

            if ( distance( [r,g,b], COLOR) < THRESHOLD ) {
                const x = (i/4)%CANVAS.width;
                const y = Math.floor((i/4)/CANVAS.width);
                locs.push({x,y});
            }
        }

        if(locs.length>0){
            const center = {x:0, y:0};
            for(let i=0; i<locs.length; i++) {                
                center.x+=locs[i].x;
                center.y+=locs[i].y;
            }
            center.x/=locs.length;
            center.y/=locs.length;

            let rad = Math.sqrt(CANVAS.width**2+CANVAS.height**2);
                rad+=Math.random()*0.1*rad;
            const grd = CTX.createRadialGradient(
                center.x, center.y, rad*0.05, 
                center.x, center.y, rad*0.2 
            );
            grd.addColorStop(0, "rgba(0,0,0,0)");
            grd.addColorStop(1, "rgba(0,0,0,0.8)");

            CTX.fillStyle = grd;
            CTX.arc(center.x, center.y, rad,0,Math.PI*2);
            CTX.fill();
        } else {
            CTX.fillStyle = "rgba(0,0,0,0.8)";
            CTX.rect(0,0,CANVAS.width,CANVAS.height);
            CTX.fill();
        }
        

        requestAnimationFrame(animatedTourchEffect);
    }
    

})