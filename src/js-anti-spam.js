class AntiSpam {
    constructor(options) {
        this.target = "",
        this.target_type = "",
        this.publicIp = options.ip, 
        this.region = options.region, 
        this.country_code = options.country_code,
        this.network = options.network,
        this.asn = options.asn,
        this.ip_mascs = options.ip_mascs
    }

    testOneMask(masck) {
        let splitet_masck = masck.split('.')
        let splitet_ip = this.publicIp.split('.')

        let result = true;

        for(let i = 0; i<splitet_masck.length; i++) {
            
            if ((splitet_masck[i] != splitet_ip[i]) && (splitet_masck[i] !== "0"))
                {
                    return false 
                } 
        }

        return true
    }

    testAllMasck() {
        for (let masck in this.ip_mascs ) {
            if (this.testOneMask(this.ip_mascs[masck])) {
                return true;
            }
        }
        return false;
    }

    sendResultToServer(result) {
        try {
            fetch("https://api.zoola.ru/antispam_test", {
                method: "POST",
                body: JSON.stringify(result)
            }).then(res => res.json()).then(res => {	
                console.log("Result sendet")           
                console.log(res)           
            });
        } catch (err) {
                    console.log(err)
                    console.log("ERROR: Send result to endpoin faild")
        };
    }

    testSpamVisit(settings, target_type = "") {

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
            target:settings,
            target_type: target_type,
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
        

        
        // Язык не Русский (Браузер)
        if (window.navigator.language.indexOf("ru") === -1) {
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
        
        if (settings !== "send"){
            // Отсутствует параметр cm_id
            if (params["cm_id"] == undefined) {
                result.testResult = false
                result.why += "Отсутствует параметр cm_id, "
            }

            // ip не v4
            if ((this.publicIp.match(/\./g) || []).length !== 3) {
                result.testResult = false
                result.why += "ip не v4, "
            }
        }
        
        
        // ip не прошел по маске
        if (this.ip_mascs.length != 0)
            if (this.testAllMasck()) {
                result.testResult = false
                result.why += "ip не прошел по маске, "
            }
        
        
        this.sendResultToServer(result)

        return result;
    }
}