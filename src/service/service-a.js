(function (name, factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define(["../vendor/jquery/jquery.min.js"], factory);

    } else if (typeof module === "object" && module.exports) {

        // Node, CommonJS-like
        module.exports = factory();

    } else {

        // Browser globals (this is window)
        this[name] = factory(jQuery);

    }

}("ServiceA", function ($) {
    
    var ServiceA = function(){
        document.getElementById("service-a").innerText = "service a is running";
    }
        
    return ServiceA;

}));