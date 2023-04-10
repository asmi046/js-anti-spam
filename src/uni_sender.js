let tester = null
const counterNumber = 87721291 //fine-repair.ru

document.addEventListener("DOMContentLoaded", () => {
    
    fetch("https://ipapi.co/json").then(response => response.json()).then(response => {
        document.querySelector("#publicIP").content = response.ip
        document.querySelector("#publicIP_region").content = response.region
        document.querySelector("#publicIP_country_code").content = response.country_code
        document.querySelector("#publicIP_network").content = response.network
        document.querySelector("#publicIP_asn").content = response.asn
        
        tester = new AntiSpam({
            ip:document.querySelector("#publicIP").content,
            region:document.querySelector("#publicIP_region").content,
            country_code:document.querySelector("#publicIP_country_code").content,
            network:document.querySelector("#publicIP_network").content,
            asn:document.querySelector("#publicIP_asn").content,
            ip_mascs:["123.122.0.0","46.62.64.0","109.195.0.0" ]
        });
    })
    
    function messageSendet() {
        messageModalWin.classList.toggle('active');
    }

    const all_phone_lnk = document.querySelectorAll("a[href^='tel:']")
    for (let i =0; i<all_phone_lnk.length; i++) {
        // Обработка клика по телефону
        all_phone_lnk[i].addEventListener("mouseenter", e => {
            
            let testResults = tester.testSpamVisit('event', 'phoneIn');
            console.log(testResults)

            if (testResults.testResult) {
                console.log("phone over")
                ym(counterNumber, 'reachGoal', 'phoneIn')
            }
        });
        
        // Обработка наведения на телефону
        all_phone_lnk[i].addEventListener("click", e => {
            
            let testResults = tester.testSpamVisit('event', 'phoneClick');
            console.log(testResults)

            if (testResults.testResult) {
                console.log("phone click")
                ym(counterNumber, 'reachGoal', 'phoneClick')
            }
        });
    }
        

    let allPageForm = document.querySelectorAll("form");

    for (let i =0; i<allPageForm.length; i++)
        allPageForm[i].addEventListener("submit", e => {
            e.preventDefault();
            
            var formData = new FormData(allPageForm[i]);

            if (tester == null) return;

            let testResults = tester.testSpamVisit('send', formData.get("phone"));
            
            console.log(testResults)

            if (testResults.testResult) {
                var formData = new FormData(allPageForm[i]);
                
                console.log(formData["phone"])

                const formDataObj = {};
                
                formData.forEach((value, key) => (formDataObj[key] = value));
                
                var fullObject = Object.assign({}, formDataObj, testResults);
                
                
                try {
                    ComagicWidget.sitePhoneCall({
                        phone: fullObject.phone
                    })
                } catch (err) {
                        console.log(err)
                        console.log("No UIS")
                };


                try {
                fetch("https://api.zoola.ru/send_order", {
					method: "POST",
					body: JSON.stringify(fullObject)
					}).then(res => res.json()).then(res => {	
                        console.log(res)    
			    	});

                } catch (err) {
                    console.log(err)
                    console.log("No ZOLLA")
                };

                ym(counterNumber, 'reachGoal', 'messageSend')
                allPageForm[i].reset()
            }

            messageSendet();
        })
  });