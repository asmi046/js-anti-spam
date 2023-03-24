class AntiSpam {
    constructor(options) {
        this.publicIp = options.ip, 
        this.region = options.region, 
        this.country_code = options.country_code,
        this.network = options.network,
        this.asn = options.asn
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
            region: this.region,
            country_code: this.country_code,
            network: this.network,
            asn: this.asn,
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
        
        // Язык не Русский (Браузер)
        if (window.navigator.language !== "ru") {
            result.testResult = false
            result.why += "Язык не Русский (Браузер), "
        }
        
        // Код страны не RU (IP)
        if (this.country_code !== "RU") {
            result.testResult = false
            result.why += "Код страны не RU (IP), "
        }
        
        // Регион не Moscow (IP)
        if (this.region.indexOf("Moscow") === -1) {
            result.testResult = false
            result.why += "Регион не Moscow (IP), "
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