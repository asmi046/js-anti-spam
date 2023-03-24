let tester = null;

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
        alert("Вроде отправили!")
    }

    let allPageForm = document.querySelectorAll("form");

    console.log(allPageForm)
    for (let i =0; i<allPageForm.length; i++)
        allPageForm[i].addEventListener("submit", e => {
            e.preventDefault();
            
            if (tester == null) return;
            
            let testResults = tester.testSpamVisit('send');
            console.log(testResults)

            if (testResults.testResult) {
                var formData = new FormData(allPageForm[i]);
                
                const formDataObj = {};
                
                formData.forEach((value, key) => (formDataObj[key] = value));
                
                var fullObject = Object.assign({}, formDataObj, testResults);
                
                fetch("https://api.zoola.ru/send_order", {
					method: "POST",
					body: JSON.stringify(fullObject)
					}).then(res => res.json()).then(res => {	
                        if (res["ok"] === true) {
                            messageSendet()
                            allPageForm[i].reset()
							try {
								ComagicWidget.sitePhoneCall({
								    phone: fullObject.phone
								})
								} catch (err) {
									console.log(err)
									console.log("No UIS")
							    };
						}
				});	
            }
            
            
            
        })
  });