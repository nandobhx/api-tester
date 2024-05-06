document.addEventListener("DOMContentLoaded", () => {
    
    // Request
    const requestForm = document.querySelector(".request__form");
    const selectTechnology = document.querySelector(".request__select_technology");
    const selectVerb = document.querySelector(".request__verb");
    const inputUrl = document.querySelector(".request__url_input");
    const headerAuthorization = document.querySelector(".request__authorization");
    const requestCodeBody = document.querySelector(".request__code_body");
    
    // Response
    const responseForm = document.querySelector(".response__form");
    const inputStatus = document.querySelector(".response__input_status");
    const responseCodeBody = document.querySelector(".response__code_body");
    
    // Backdrop
    const backdrop = document.querySelector(".backdrop");

    const clearResponse = () => {
        backdrop.classList.add("backdrop--show");
        inputStatus.classList.remove("response__input_status--error");
        inputStatus.classList.remove("response__input_status--sucess");
        responseCodeBody.innerHTML = "";
    }

    // Technology Fetch
    const fetchRequest = () => {

        clearResponse();

        const config = {
            method: selectVerb.value,
            headers: new Headers()
        };
        
        const authorization = headerAuthorization.value.trim();

        if (authorization != "") {
            config.headers.append("Authorization", authorization);
        }

        const body = requestCodeBody.value.trim();

        if (body != "") {
            config.body = body;
            config.headers.append("Content-Type", "application/json; charset=utf-8");
        }
        
        fetch(inputUrl.value, config)
            .then((response) => {
                inputStatus.value = `${response.status} - ${response.statusText}`;
                if (response.ok) {
                    inputStatus.classList.add("response__input_status--sucess");
                } else {
                    inputStatus.classList.add("response__input_status--error");
                }
                return response.text();
            })
            .then((data) => {
                responseCodeBody.innerHTML = data;
            })
            .catch((error) => {
                inputStatus.value = error.message;
                inputStatus.classList.add("response__input_status--error");
            })
            .finally(() => {
                backdrop.classList.remove("backdrop--show");
            });
    }

    // Technology XHR
    const XHRequest = () => {

        clearResponse();

        const xhr = new XMLHttpRequest();
        xhr.open(selectVerb.value, inputUrl.value);

        xhr.addEventListener("readystatechange", (event) => {

            if (xhr.readyState == XMLHttpRequest.DONE) {

                let statusText = xhr.statusText;

                if (xhr.status >= 200 && xhr.status < 300) {
                    inputStatus.classList.add("response__input_status--sucess");                    
                } else {
                    inputStatus.classList.add("response__input_status--error");
                    if (statusText === "") {
                        statusText = "Failed to XHR";
                    }
                }

                inputStatus.value = `${xhr.status} - ${statusText}`;
                responseCodeBody.innerHTML = xhr.responseText;
                backdrop.classList.remove("backdrop--show");
            }

        });

        const authorization = headerAuthorization.value.trim();

        if (authorization != "") {
            xhr.setRequestHeader("Authorization", authorization);
        }        

        const body = requestCodeBody.value.trim();

        if (body != "") {
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(body);
        } else {
            xhr.send();
        }

    }
    
    // Function SendRequest
    const sendRequest = (event) => {

        event.preventDefault();        
        switch (selectTechnology.value) {
            case "fetch":
                fetchRequest();
                break;
            case "xhr":
                XHRequest();
                break;
        }
        
    }

    // Event Submit
    requestForm.addEventListener("submit", sendRequest);

    // Event Submit
    responseForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
    
    // Function ChangeVerb
    const changeVerb = () => {    
        if (selectVerb.value === "GET") {
            requestCodeBody.value = "";
            requestCodeBody.disabled = true;
        } else {
            requestCodeBody.disabled = false;
        }
    };

    // Event Change
    selectVerb.addEventListener("change", changeVerb);
    // Event Reset
    requestForm.addEventListener("reset", changeVerb);
    // Call
    changeVerb();

});