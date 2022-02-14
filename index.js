const getLength = document.getElementById("getLength")
getLength.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id},
      func: getLengthFunction,
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

function getLengthFunction(){
    const playlist = document.getElementsByTagName("ytd-playlist-panel-renderer")[1]?.getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer")
    if(!playlist) return null
    let totalTime = 0
    for(let i =0;i<playlist.length;i++){
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
