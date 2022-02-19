const getLength = document.getElementById("getLength")
getLength.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id},
      func: getLengthFunction,
      args: [document.getElementById('start').value,document.getElementById('end').value]
    },(totalTime)=>{
        if(totalTime){
        const hours = Math.trunc(totalTime[0].result/3600)
        const mins = Math.trunc((totalTime[0].result-hours*3600)/60)
        const secs = totalTime[0].result-(hours*3600 + mins*60)
        document.getElementById("hours").innerHTML=`${hours} hrs`
        document.getElementById("mins").innerHTML=`${mins} mins`
        document.getElementById("secs").innerHTML=`${secs} secs`
    }
    });
    
  });

function getLengthFunction(s,e){
    const playlist = Array.from(document.getElementsByTagName("ytd-playlist-panel-renderer")[1]?.getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer")).filter(e => e.innerText)
    if(!playlist) return null
    let totalTime = 0
    const start = s?parseInt(s)-1:0
    const end = e?parseInt(e):playlist.length
    for(let i = start;i<end;i++){
        const howLong = playlist[i].innerText
        if(howLong){
            const times = howLong.trim().split(":")
            if(times.length === 3)
                totalTime+=(parseInt(times[0])*3600 + parseInt(times[1])*60 + parseInt(times[2]))
            
            if (times.length === 2)
                totalTime+=(parseInt(times[0])*60 + parseInt(times[1]))
            
            if (times.length === 1)
                totalTime+=parseInt(times[0])
        }}
    return(totalTime)
}
