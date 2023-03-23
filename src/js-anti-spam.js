class AntiSpam {
    constructor(options) {
        this.publicIp = options.ip 
    }

    testSpamVisit() {

        let params = window
            .location
            .search
            .replace('?','')
            .split('&')
            .reduce(
                function(p,e){
                    var a = e.split('=');
                    p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                    return p;
                },
                {}
            );

        let result = {
            publicIp: this.publicIp,
            referer: document.referrer,
            userAgent: window.navigator.userAgent,
            cm_id: params["cm_id"],
            language: window.navigator.language,
            testResult:true,
            why:""
        }
        
        // Пустой рефер
        if (document.referrer === "") {
            result.testResult = false
            result.why += "Пустой рефер, "
        }
        
        // Пустой userAgent
        if (window.navigator.userAgent === ""){
            result.testResult = false
            result.why += "Пустой userAgent, "
        }
        
        // Отсутствует параметр cm_id
        if (params["cm_id"] == undefined) {
            result.testResult = false
            result.why += "Отсутствует параметр cm_id, "
        }
        
        // Язык не Русский
        if (window.navigator.language !== "ru") {
            result.testResult = false
            result.why += "Язык не Русский, "
        }
        
        // ip не v4
        if ((this.publicIp.match(/\./g) || []).length !== 3) {
            result.testResult = false
            result.why += "ip не v4, "
        }
        

        return result;
    }
}

// console.log(document.referrer)
// console.log(window.navigator)
// console.log(window.navigator.userAgent)