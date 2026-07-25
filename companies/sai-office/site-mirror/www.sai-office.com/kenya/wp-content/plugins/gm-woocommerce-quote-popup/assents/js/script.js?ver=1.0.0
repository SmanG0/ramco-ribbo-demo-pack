document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".gmwqp_inq").forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            var productEnquiryTitle = this.getAttribute("title");
            var attrId = this.getAttribute("attr_id");
            //document.querySelector(".gmwqp_popup_title").innerHTML = productEnquiryTitle;
            document.querySelector(".gmqqp_product_vl").value = productEnquiryTitle;
            document.querySelector(".gmqqp_product_id").value = attrId;

            // Open custom modal
            openCustomModal(".gmwqp_popup_op");

            return false;
        });
    });

    document.querySelector(".gmwqp_popup_op_form").addEventListener('submit', function(event) {
        event.preventDefault();
        document.body.classList.add('gmwqp_loader');
        document.querySelectorAll(".gmwqpmsgc").forEach(function(msgElement) {
            msgElement.remove();
        });
        var formData = new FormData(this);
        formData.append('_ajax_nonce', gmwqp_ajax_object.ajax_nonce);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", gmwqp_ajax_object.ajax_url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var response = xhr.response;
            if (response.msg === 'error') {
                document.querySelector(".gmwqp_popupcontant").insertAdjacentHTML('beforeend', response.returnhtml);
            } else {
                event.target.reset();
                document.querySelector(".gmwqp_popupcontant").insertAdjacentHTML('beforeend', response.returnhtml);
                var evt = new CustomEvent("Gm_enquiry_submitted", { detail: response });
                window.dispatchEvent(evt);
            }
            if (response.redirect === 'yes') {
                setTimeout(function() {
                    window.location.replace(response.redirect_to);
                }, 1500);
            }
            document.body.classList.remove('gmwqp_loader');
            scrollSmoothToBottom('gmwqp_popupcontant');
        };
        xhr.send(formData);

        return false;
    });

    function scrollSmoothToBottom(id) {
        var div = document.getElementById(id);
        div.scroll({
            top: div.scrollHeight - div.clientHeight,
            behavior: 'smooth'
        });
    }

    function openCustomModal(selector) {
        var modal = document.querySelector(selector);
        modal.style.display = "block";
        document.body.classList.add('gmwqp-modal-open'); // Add class to body

        // Close the modal when clicking the close button
        document.querySelector('.gmwqp_close').addEventListener('click', function(event) {
            event.preventDefault();
            closeModal(selector);
        });

        // Close the modal when clicking outside of it
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal(selector);
            }
        };
    }
    function closeModal(selector) {
        var modal = document.querySelector(selector);
        modal.style.display = "none";
        document.body.classList.remove('gmwqp-modal-open'); // Remove class from body
    }

   
});
