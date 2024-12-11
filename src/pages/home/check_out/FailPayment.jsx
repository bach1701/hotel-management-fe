const SuccessPayment = () => {
    return (
        <div class="not_found_block">
            <div class="container">
            <div class="row">
                <div class="col-md-12">
                <section id="not-found" class="center">
                    <h2 class="margin-bottom-10"><i class="fas fa-check-circle" style={{ color: 'green' }}></i></h2>
                    <p style={{ marginTop: '10px', color: 'black' }}><b>Checkout - Payment Faillllllllll!</b></p>
                    <div class="utf_error_description_part utf_ferror_description">  
                        <span class="f-primary animated v fadeInRight">We have sent your booking summary to <b>Thank you.</b></span> 
                    </div>
                    <a href="#" class="button margin-top-20">Visit Dashboard</a>
                    <a href="#" target="_blank" class="button margin-top-20">View Invoice 🧾</a>
                    <div class="row">
                    <div class="col-lg-6 col-lg-offset-3">
                        <div class="gray-style margin-top-50 margin-bottom-10">
                        </div>
                    </div>
                    </div>
                </section>
                </div>
            </div>
            </div>
        </div>
    )
}

export default SuccessPayment;