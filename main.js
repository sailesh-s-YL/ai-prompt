document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader--hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });

    var base64Image = "";

    function loadFile(event) {
        const image = event.target.files[0];
        if (image) {
            var reader = new FileReader();

            reader.onload = function (e) {
                document.getElementById("inputimg").src = e.target.result;
                document.getElementById("inputimg").width = 400;
                document.getElementById("inputimg").height = 400;
                base64Image = e.target.result.replace("data:image/jpeg;base64,", "");
            };

            reader.readAsDataURL(image);
        }
    }

    function uploadImage() {
        const file = document.getElementById("file").files[0];
        if (!file) {
            alert("Please select a file");
            return;
        }

        showLoading();

        document.getElementById("outputimg").src = "";

        let obj = {
            userId: "yantralivetest@gmail.com",
            base64: base64Image,
        };

        fetch("https://api.mayamaya.us/uploadImageToGCP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
            .then(async (GCPresponse) => {
                const GCPData = await GCPresponse.json();
                console.log(GCPData, "GCPData");

                fetch("https://image-enhancement-backend.vercel.app/img_enhancer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fileUrl: GCPData.result }),
                })
                    .then(async (replicate_response) => {
                        const replicateData = await replicate_response.json();
                        console.log(replicateData, "replicateData");

                        document.getElementById("outputimg").src = replicateData.result;
                        document.getElementById("outputimg").width = 400;
                        document.getElementById("outputimg").height = 400;

                        hideLoading();
                    })
                    .catch((error) => {
                        console.log(error);
                        hideLoading();
                    });
            })
            .catch((error) => {
                console.log(error);
                hideLoading();
            });
    }

    function reset() {
        document.getElementById("inputimg").src =
            "https://replicate.delivery/mgxm/59d9390c-b415-47e0-a907-f81b0d9920f1/187400315-87a90ac9-d231-45d6-b377-38702bd1838f.jpg";
        document.getElementById("outputimg").src =
            "https://replicate.delivery/mgxm/59d9390c-b415-47e0-a907-f81b0d9920f1/187400315-87a90ac9-d231-45d6-b377-38702bd1838f.jpg";
        document.getElementById("file").value = "";
        base64Image = "";
    }

    function imageopen(url) {
        window.open(url);
    }

    function simulateLoading() {
        var overlay = document.getElementById("loadingOverlay");

        // Display the overlay
        overlay.style.display = "block";

        // Simulate loading (you can replace this with your actual loading logic)
        setTimeout(function () {
            // Hide the overlay after the loading is done
            overlay.style.display = "none";
        }, 2000); // Change 2000 to the duration of your loading process in milliseconds
    }

    function showLoading() {
        loader.classList.remove("loader--hidden");
        simulateLoading(); // You can remove this line if you don't want to simulate loading
    }

    function hideLoading() {
        loader.classList.add("loader--hidden");
    }
});
