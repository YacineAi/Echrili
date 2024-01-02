<template>
  <!-- Start Header  -->
    <div class="header">
      <img src="~/assets/images/logo.png" alt="logo">
      <h1>Echrili Store</h1>
    </div>
  <!-- End Header  -->
  <div class="flex flex-col justify-center">
    <div class="text-center mb-20">
      <h1 class="py-10 text-3xl font-bold rounded-lg bg-brand md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        متجر شريلي نافذتكم الالكترونية للتسوق من المتاجر العالمية </h1>

      <span class="mb-2 text-2xl rounded-lg bg-brand md:text-1xl bg-clip-text">
        Aliexpress   ضع رابط المنتج الذي تريد شرائه من موقع </span>
       
        
    </div>
    <div class="container mx-auto flex flex-col items-center gap-y-10 md:gap-y-10 px-7">
      <!-- Input and button -->
      <div class="flex flex-col md:flex-row w-full md:w-3/4">
        <input v-model="searchQuery" type="text" placeholder="https://a.aliexpress... Or 100XXXXXXXX" class="flex-grow rounded-lg bg-gray-50 px-4 py-2 mb-4 md:mb-0 md:mr-2 outline-none focus:ring-2 focus:ring-blue-400"/>
        <button @click="searchClicked" class="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 focus:ring-2 focus:ring-blue-400">Search</button>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center">
        <div class="flex flex-row gap-3 mt-4">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
      
      <!-- Card data for mobile view -->
      <div v-if="cardData && !isLoading" class="w-full md:hidden">
        <div v-if="cardData.ok == false">
          <div class="text-center bg-white p-4 rounded-lg shadow-md">
            <p class="text-gray-500 mr-1 font-bold"> المنتج الذي أدخلته غير موجود! 🧐 </p>
          </div>
        </div>
        <div v-else>
          <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-center mb-4">
            <div class="w-80 h-80 rounded-lg overflow-hidden">
              <img :src="cardData.cover" alt="Product Image" class="h-full w-full object-cover">
            </div>
          </div>
          <div class="text-center">
            <p class="text-gray-700 mb-10" dir="rtl">{{ cardData.name }}</p>
            <h2 class="text-left  text-xm font-bold text-gray-800 mb-2">Livraison : {{ calcShipping() }}</h2>
            <h2 class="text-left  text-xm font-bold text-gray-800 mb-2">Prix : {{ calcPrice() }}</h2>
            <!-- Other details for mobile -->
            <p class="text-left text-gray-700 mb-2"><span>&#x1F389;</span> Sales: {{ cardData.sales }} </p>
            <p class="text-left text-gray-700 mb-2"><span>&#x1F3E2;</span> Store: {{ cardData.store }} </p>
            <p class="text-left text-gray-700 mb-5"><span>&#x2B50;</span> Store Rate: {{ cardData.storeRate }} </p>
          </div>
          <div class="flex items-center gap-2">
          <button :disabled="items === 1" title="Remove" class="group cursor-pointer outline-none" @click="removeItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
            </svg>
          </button>
          <p>{{ items }}</p>
          <button title="Add" class="group cursor-pointer outline-none" @click="addItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
              <path d="M8 12H16" stroke-width="1.5"></path>
              <path d="M12 16V8" stroke-width="1.5"></path>
            </svg>
          </button>
        </div>
          <!-- Variant selection buttons without images -->
          <div v-if="cardData.variants.props != 'No SKU property available'">
          <template v-for="(variant, index) in cardData.variants.props" :key="index">
            <div class="mt-4">
              <p class="text-gray-700 font-semibold mb-2"> {{ variant.skuPropertyName }}: {{ getName(cardData.variants.defAttr, index) }} </p>
              <div class="flex flex-wrap gap-2">
                <template v-for="(value, vIndex) in variant.skuPropertyValues" :key="vIndex">
                  <div v-if="value.skuPropertyImageSummPath !== undefined">
                    <!-- If available is 0, make the image disabled -->
                    <img v-if="value.skuPropertyImageSummPath" :src="value.skuPropertyImageSummPath" :class="getImgClasses(index, vIndex)" @click="setSelectedImage(index, vIndex)" class="w-12 h-12 object-cover rounded-lg"/>
                  </div>
                  <div v-else>
                    <!-- Disable the button and add a dashed border if available is 0 -->
                    <button :disabled="isPropertyValueUnavailable(index, vIndex)" :class="getButtonClasses(index, vIndex)" class="bg-gray-200 rounded-lg px-3 py-1" @click="value.available !== 0 && setSelectedButton(index, vIndex)"> {{ value.skuPropertyTips }} </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <!-- -->
          <div class="text-center flex justify-center space-x-7 mt-4">
            <h2 class="text-xl font-bold text-gray-800">Total : {{ calcTotal() }}</h2>
          </div>
          <p class="text-center text-xs">سعر المنتج + الشحن * سعر الدولار + العمولة</p>
        </div>
        </div>
      </div>
      <!-- Card data for desktop view -->
      <div v-if="cardData && !isLoading" class="w-full max-w mx-auto rounded-lg shadow-md bg-white p-4 md:p-6 hidden md:block">
        <div v-if="cardData.ok == false">
          <div class="text-center items-center">
            <p class="text-gray-500 mr-1 font-bold"> المنتج الذي أدخلته غير موجود! 🧐 </p>
          </div>
        </div>
        <div v-else>
          <div class="relative flex w-full items-center">
            <div class="text-center absolute bottom-0 right-0">
              <h2 class="text-xl font-bold text-gray-800">Total : {{ calcTotal() }}</h2>
              <p class="text-xs">سعر المنتج + الشحن * سعر الدولار + العمولة</p>
            </div>
          <div class="h-96 w-96 rounded-lg object-cover flex-shrink-0">
            <img :src="cardData.cover" alt="Product Image" class="h-full w-full rounded-lg object-cover">
          </div>
          <div class="flex flex-col justify-between ml-5">
            <p class="text-xl font-bold text-gray-800 mb-4">{{ cardData.name }}</p>
            <div class="flex items-center mb-1">
              <p class="text-gray-500 mr-1 font-bold"> {{ cardData.rate }} </p>
              <div class="text-yellow-400 text-xl">
                <template v-if="cardData.rate == 0.0"> ☆ </template>
                <template v-else>
                  <span v-for="i in Math.floor(cardData.rate)" :key="i">★</span>
                  <span v-if="cardData.rate % 1 !== 0">☆</span>
                </template>
              </div>
              <p class="text-sm text-gray-700"> ({{ cardData.totalRates }})  </p>
            </div>
            <h2 class="text-xm font-bold text-gray-800  mb-2">Livraison : {{ calcShipping() }}</h2>
            <h2 class="text-xm font-bold text-gray-800  mb-1">Prix : {{ calcPrice() }}</h2>
            <!-- Other details for desktop -->
            <p class="text-gray-700"><span>&#x1F389;</span> Sales: {{ cardData.sales }} </p>
            <p class="text-gray-700"><span>&#x1F3E2;</span> Store: {{ cardData.store }} </p>
            <p class="text-gray-700"><span>&#x2B50;</span> Store Rate: {{ cardData.storeRate }} </p>
            <div class="flex items-center gap-2 mt-2">
              <button :disabled="items === 1" title="Remove" class="group cursor-pointer outline-none" @click="removeItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
                  <path d="M8 12H16" stroke-width="1.5"></path>
                </svg>
              </button>
              <p>{{ items }}</p>
              <button title="Add" class="group cursor-pointer outline-none" @click="addItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" class="stroke-zinc-400 fill-none">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke-width="1.5"></path>
                  <path d="M8 12H16" stroke-width="1.5"></path>
                  <path d="M12 16V8" stroke-width="1.5"></path>
                </svg>
              </button>
            </div>
            <!-- Variant selection buttons without images -->
            <div v-if="cardData.variants.props != 'No SKU property available'">
              <template v-for="(variant, index) in cardData.variants.props" :key="index">
            <div class="mt-4">
              <p class="text-gray-700 font-semibold mb-2"> {{ variant.skuPropertyName }}: {{ getName(cardData.variants.defAttr, index) }} </p>
              <div class="flex flex-wrap gap-2">
                <template v-for="(value, vIndex) in variant.skuPropertyValues" :key="vIndex">
                  <div v-if="value.skuPropertyImageSummPath !== undefined">
                    <!-- If available is 0, make the image disabled -->
                    <img v-if="value.skuPropertyImageSummPath" :src="value.skuPropertyImageSummPath" :class="getImgClasses(index, vIndex)" @click="setSelectedImage(index, vIndex)" class="w-12 h-12 object-cover rounded-lg"/>
                  </div>
                  <div v-else>
                    <!-- Disable the button and add a dashed border if available is 0 -->
                    <button :disabled="isPropertyValueUnavailable(index, vIndex)" :class="getButtonClasses(index, vIndex)" class="bg-gray-200 rounded-lg px-3 py-1" @click="value.available !== 0 && setSelectedButton(index, vIndex)"> {{ value.skuPropertyTips }} </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
          </div>
        </div>
        <!-- -->
        </div>
      </div>
      <div v-if="cardData && !isLoading" class="flex flex-col items-center md:gap-y-5 px-7 p-5 text-center" dir="rtl">
      <span class="bg-red-500 font-bold text-white px-2 py-2 rounded">ملاحظة</span>
      <p class="text-xl">هذا السعر النهائي خاضع لعمولة الخدمة في <span class="font-bold">Echrili Store</span> + تكاليف الشحن و التوصيل من الصين لمحل سكنك في الجزائر. يمكنك معرفة طريقة حساب السعر عبر جدول العمولات و هذا لتفادي الوقوع في شبهة <span class="font-bold">بيع ما لا نملك</span></p>
    </div>
    </div>

  </div>
  <!-- Start Bot Telegram  -->

<div class="bot-t text-center mt-4 flex flex-col items-center">
  <span class="bot-text mb-5 font-bold text-1xl bg-[#22CF1B]	w-fit	 rounded-md ">أستخدم هذا البوت للحصول على اسعار  أقل </span>
  
   
      <a href="https://t.me/Echrili_bot" ><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 256 256"><defs><linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#2AABEE"/><stop offset="100%" stop-color="#229ED9"/></linearGradient></defs><path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/><path fill="#FFF" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/></svg></a>
    
  
</div>

  <!-- End Bot Telegram  -->



  <!-- More Services  -->


  <div class="container">
        <div class="more-s flex items-center  justify-between   ">
            <div class="img  ">
                <img src="~/assets/images/services.jpg" alt="services" >
            </div>
            <div dir="rtl" class="text ">
                <h1 class="font-bold text-3xl mt-5 bg-[#04017B] w-fit	 rounded text-white">ماهي خدماتنا الأ خرى ؟</h1>
                <p  class="font-bold mt-5  ">بالاضافة لخدمة الوساطة التجارية والخدماتية<br> يقدم لكم متجر شريلي عدة خدمات اخرى اهمها : </p>
                <h3 class="mt-5 font-bold text-2xl bg-[#9DE9EE] rounded-md  w-fit	 ">انشاء المواقع وتصميم المتاجر الالكترونية</h3>
                <h3 class="mt-5 font-bold text-2xl bg-[#9DE9EE] rounded-md 	w-fit	 ">عمل اعلانات فايسبوك ممولة Sponsoring</h3>
                <h3 class="mt-5 font-bold text-2xl bg-[#9DE9EE] rounded-md	w-fit	 ">بيع جميع قطع غيار السيارات الالمانية </h3>
                <h3 class="mt-5 font-bold text-2xl bg-[#9DE9EE] rounded-md	w-fit	 ">خدمات Freelance متنوعة </h3>
                <h3 class="mt-5 font-bold text-2xl bg-[#9DE9EE] rounded-md	w-fit	 ">بيع وشراء الارصدة المالية لمختلف البنوك والمحافظ الرقمية</h3>

            </div>

        </div>
        
  </div>

  <!-- End Services  -->


  <!-- جدول عمولة  -->
  <div class="sid-title flex justify-center			 ">
    <h1 class="mb-5 mt-20 font-bold text-3xl bg-[#22CF1B]	w-fit	rounded-md "> جدول العمولات</h1>
  </div>
     
  <div class="container">
    <div dir="rtl" class="flex justify-center	">
      <table class="table-auto w-4/5 ">
  <thead class="bg-[#D0D0D0] ">
    <tr>
      <th >سعر بدولار </th>
      <th>عمولة</th>
      
    </tr>
  </thead>
  <tbody class="bg-[#EEE7E7]">
    <tr>
      <td >تحت 3$</td>
      <td>عمولة 100 دج</td>
      
    </tr>
    <tr>
      <td>بين 3$ و 5$</td>
      <td>عمولة 150 دج</td>
      
    </tr>
    <tr>
      <td>بين 5$ و 11$</td>
      <td>عمولة  300 دج</td>
      
    </tr>
    <tr>
      <td>بين 11$ و 15$</td>
      <td>عمولة  400 دج</td>
      
    </tr>
    <tr>
      <td>بين 15$ و 18$</td>
      <td>عمولة  500 دج</td>
      
    </tr>
    <tr>
      <td>بين 18$ و 22$</td>
      <td>عمولة  600 دج</td>

    </tr>
    <tr>
      <td>بين 22$ و 25$</td>
      <td>عمولة  700 دج</td>
      
    </tr>
    <tr>
      <td>بين 25$ و 28$</td>
      <td>عمولة  800 دج</td>
      
    </tr>
    <tr>
      <td>بين 28$ و 31$</td>
      <td>عمولة  900 دج</td>
      
    </tr>
    <tr>
      <td>بين 31$ و 36$</td>
      <td>عمولة  1000 دج</td>
      
    </tr>
    <tr>
      <td>بين 36$ و 40$</td>
      <td>عمولة  1200 دج</td>
      
    </tr>
    <tr>
      <td>بين 40$ و 48$</td>
      <td>عمولة  1300 دج</td>
      
    </tr>
    <tr>
      <td>بين 48$ و 60$</td>
      <td>عمولة  1400 دج</td>
      
    </tr>
    <tr>
      <td>بين 60$ و 80$</td>
      <td>عمولة  1500 دج</td>
      
    </tr>
    <tr>
      <td>بين 80$ و 100$</td>
      <td>عمولة  1800 دج</td>
      
    </tr>
    <tr>
      <td>بين 100$ و 120$</td>
      <td>عمولة  2200 دج</td>
      
    </tr>
    <tr>
      <td>بين 120$ و 160$</td>
      <td>عمولة  2500 دج</td>
      
    </tr>
    <tr>
      <td>فوق 200$</td>
      <td>عمولة  2900 دج</td>
      
    </tr>
    
  </tbody>
</table>
    </div>
   
  </div>
  <!-- جدول عمولة  -->
  <!-- من نحن  -->
  <div class="sid-title flex justify-center			 ">
    <h1 class="mb-5 mt-20 font-bold text-3xl bg-[#F6AA29]	w-fit	rounded-md ">؟  من نحن </h1>
  </div>
  <h1 class="mb-5 mt-20 font-bold text-2xl text-center	">   أتصل بنا </h1>
  <!-- من نحن  -->
  <div class="container">
    <div class="contacet flex justify-around">
        <div class="info ">
         <div class="email flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="42.45" height="32" viewBox="0 0 256 193"><path fill="#4285F4" d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"/><path fill="#34A853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"/><path fill="#EA4335" d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"/><path fill="#FBBC04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"/><path fill="#C5221F" d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"/></svg>
            <h1 class="ml-4 font-bold"><a   href = "mailto: CHRILIStore@gmail.com">CHRILIStore@gmail.com</a></h1>
         </div>
            <div class="phone flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="#000" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M28 20L41 7.5"/><path stroke-linecap="round" d="M28 7H41V20"/><path fill="#2F88FF" d="M14.3758 9.79424C15.1023 9.79424 15.7717 10.1883 16.1244 10.8235L18.5708 15.2303C18.8911 15.8073 18.9062 16.5052 18.611 17.0955L16.2542 21.8092C16.2542 21.8092 16.9372 25.3206 19.7956 28.179C22.6541 31.0374 26.1537 31.7086 26.1537 31.7086L30.8666 29.3522C31.4573 29.0568 32.1557 29.0721 32.7329 29.393L37.1522 31.85C37.7869 32.2028 38.1804 32.8719 38.1804 33.598V38.6715C38.1804 41.2552 35.7805 43.1213 33.3325 42.2952C28.3045 40.5987 20.4998 37.3685 15.553 32.4216C10.6061 27.4748 7.37586 19.6701 5.67934 14.6422C4.85332 12.1941 6.71941 9.79424 9.30306 9.79424H14.3758Z"/></g></svg>
              <h1 class="ml-4 font-bold" ><a  href="tel:+213 656 32 32 85">0656 32 32 85</a></h1>
              <h1 class="ml-4 font-bold" ><a  href="tel:+213 663 22 70 34">0663 22 70 34</a></h1>
            </div>
        </div>
        <div class="media-icon flex">
              <a class="mr-4" href="https://www.facebook.com/CHRiLiStore"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#1877F2" d="M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"/><path fill="#FFF" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165z"/></svg></a>
              <a class="mr-4"  href="https://t.me/Echrili_Store_Aliexpress"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><defs><linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#2AABEE"/><stop offset="100%" stop-color="#229ED9"/></linearGradient></defs><path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/><path fill="#FFF" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/></svg></a>
              <a class="mr-4"  href="https://www.tiktok.com/@echrili_store?_t=8ifnOobnpPZ&_r=1"><svg xmlns="http://www.w3.org/2000/svg" width="28.25" height="32" viewBox="0 0 256 290"><path fill="#FF004F" d="M189.72 104.421c18.678 13.345 41.56 21.197 66.273 21.197v-47.53a67.115 67.115 0 0 1-13.918-1.456v37.413c-24.711 0-47.59-7.851-66.272-21.195v96.996c0 48.523-39.356 87.855-87.9 87.855c-18.113 0-34.949-5.473-48.934-14.86c15.962 16.313 38.222 26.432 62.848 26.432c48.548 0 87.905-39.332 87.905-87.857v-96.995zm17.17-47.952c-9.546-10.423-15.814-23.893-17.17-38.785v-6.113h-13.189c3.32 18.927 14.644 35.097 30.358 44.898M69.673 225.607a40.008 40.008 0 0 1-8.203-24.33c0-22.192 18.001-40.186 40.21-40.186a40.313 40.313 0 0 1 12.197 1.883v-48.593c-4.61-.631-9.262-.9-13.912-.801v37.822a40.268 40.268 0 0 0-12.203-1.882c-22.208 0-40.208 17.992-40.208 40.187c0 15.694 8.997 29.281 22.119 35.9"/><path d="M175.803 92.849c18.683 13.344 41.56 21.195 66.272 21.195V76.631c-13.794-2.937-26.005-10.141-35.186-20.162c-15.715-9.802-27.038-25.972-30.358-44.898h-34.643v189.843c-.079 22.132-18.049 40.052-40.21 40.052c-13.058 0-24.66-6.221-32.007-15.86c-13.12-6.618-22.118-20.206-22.118-35.898c0-22.193 18-40.187 40.208-40.187c4.255 0 8.356.662 12.203 1.882v-37.822c-47.692.985-86.047 39.933-86.047 87.834c0 23.912 9.551 45.589 25.053 61.428c13.985 9.385 30.82 14.86 48.934 14.86c48.545 0 87.9-39.335 87.9-87.857z"/><path fill="#00F2EA" d="M242.075 76.63V66.516a66.285 66.285 0 0 1-35.186-10.047a66.47 66.47 0 0 0 35.186 20.163M176.53 11.57a67.788 67.788 0 0 1-.728-5.457V0h-47.834v189.845c-.076 22.13-18.046 40.05-40.208 40.05a40.06 40.06 0 0 1-18.09-4.287c7.347 9.637 18.949 15.857 32.007 15.857c22.16 0 40.132-17.918 40.21-40.05V11.571zM99.966 113.58v-10.769a88.787 88.787 0 0 0-12.061-.818C39.355 101.993 0 141.327 0 189.845c0 30.419 15.467 57.227 38.971 72.996c-15.502-15.838-25.053-37.516-25.053-61.427c0-47.9 38.354-86.848 86.048-87.833"/></svg></a>
        </div>
    </div>
  </div>
  <footer class="text-center h-10 text-white	mt-9 bg-[#333333] flex justify-center	items-center	 ">
    Copyright © Echrili Store 2024
  </footer>
</template>



<script setup>

const searchQuery = ref('');
const cardData = ref(null);
const isLoading = ref(false);
const items = ref(1);;

const selectedValues = ref([]);
const selectedButtons = ref([]);


const addItem = () => {
  items.value++; // Increment items
};

const removeItem = () => {
  if (items.value > 0) {
    items.value--; // Decrement items only if it's greater than 0
  }
};

const getName = (key, index) => {

  if (cardData.value.variants.shippingid != "Auto") {
    const clean = key.replace(`${cardData.value.variants.shippingid};`, "").replace(`;${cardData.value.variants.shippingid}`, "")
    const pairs = clean.split(';');
    console.log("prop index : ", pairs[index])
    const [ skuPropertyId, propertyValueId ] = pairs[index].split(':');
    //console.log(skuPropertyId+":" + propertyValueId)
    const matchingProp = cardData.value.variants.props.find(prop => prop.skuPropertyId == skuPropertyId);
    if (matchingProp) {
      const matchingValue = matchingProp.skuPropertyValues.find(value => value.propertyValueId == propertyValueId);
      if (matchingValue) {
        return matchingValue.skuPropertyTips;
      }
    }
  return 'nonValue';
  } else {
    const pairs = key.split(';');
    console.log("prop index : ", pairs[index])
    const [ skuPropertyId, propertyValueId ] = pairs[index].split(':');
    //console.log(skuPropertyId+":" + propertyValueId)
    const matchingProp = cardData.value.variants.props.find(prop => prop.skuPropertyId == skuPropertyId);
    if (matchingProp) {
      const matchingValue = matchingProp.skuPropertyValues.find(value => value.propertyValueId == propertyValueId);
      if (matchingValue) {
        return matchingValue.skuPropertyTips;
      }
    }
  return 'nonValue';
  }
};

//

const isPropertyValueUnavailable = (index, vIndex) => {
  //console.log("vIndex : ", vIndex)
  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  
  // Find matching propinfo based on attr
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    return prop.attr.includes(propPairs.join(';'));
  });
  //console.log(matchingPropInfo.attr)
  return matchingPropInfo ? matchingPropInfo.available == 0 : false;
};

const getButtonClasses = (index, vIndex) => {
  const isDisabled = isPropertyValueUnavailable(index, vIndex);
  return {
    'border-2 border-black': isButtonSelected(index, vIndex),
    'opacity-50 pointer-events-none border-dashed': isDisabled,
  };
};

const getImgClasses = (index, vIndex) => {
  const isDisabled = isPropertyValueUnavailable(index, vIndex);
  return {
    'border-2 border-black': isImageSelected(index, vIndex),
    'opacity-50 pointer-events-none': isDisabled,
  };
};


const isImageSelected = (index, vIndex) => {
  return selectedValues.value[index] == vIndex;
};

const isButtonSelected = (index, vIndex) => {
  return selectedButtons.value[index] == vIndex;
};

const setSelectedImage = (index, vIndex) => {
  if (cardData.value.variants.props[index].skuPropertyValues.length == 1) {
    return;
  }

  selectedValues.value[index] = vIndex;
  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  cardData.value.variants.defAttr = propPairs.join(';');
  cardData.value.cover = cardData.value.variants.props[index].skuPropertyValues[vIndex].skuPropertyImagePath;
};

const setSelectedButton = (index, vIndex) => {
  if (cardData.value.variants.props[index].skuPropertyValues.length == 1) { return; }

  selectedButtons.value[index] = vIndex;

  const propPairs = cardData.value.variants.defAttr.split(';');
  propPairs[index] = `${cardData.value.variants.props[index].skuPropertyId}:${cardData.value.variants.props[index].skuPropertyValues[vIndex].propertyValueId}`;
  cardData.value.variants.defAttr = propPairs.join(';');
};

const initializeSelectedImagesAndButtons = () => {
  if (cardData.value.variants.shippingid != "Auto") {
    if (cardData.value && cardData.value.variants && cardData.value.variants.defAttr) {
      const clean = cardData.value.variants.defAttr.replace(`${cardData.value.variants.shippingid};`, "").replace(`;${cardData.value.variants.shippingid}`, "")
      const defAttrPairs = clean.split(';');
    defAttrPairs.forEach((pair, index) => {
      const [skuPropertyId, propertyValueId] = pair.split(':');
      const matchingProp = cardData.value.variants.props[index];

      if (matchingProp) {
        const matchingImageIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingImageIndex !== -1) {
          selectedValues.value[index] = matchingImageIndex;
        }

        const matchingButtonIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingButtonIndex !== -1) {
          selectedButtons.value[index] = matchingButtonIndex;
        }
      }
    });
  }
  } else {
    if (cardData.value && cardData.value.variants && cardData.value.variants.defAttr) {
    const defAttrPairs = cardData.value.variants.defAttr.split(';');
    defAttrPairs.forEach((pair, index) => {
      const [skuPropertyId, propertyValueId] = pair.split(':');
      const matchingProp = cardData.value.variants.props[index];

      if (matchingProp) {
        const matchingImageIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingImageIndex !== -1) {
          selectedValues.value[index] = matchingImageIndex;
        }

        const matchingButtonIndex = matchingProp.skuPropertyValues.findIndex(value => value.propertyValueId == propertyValueId);
        if (matchingButtonIndex !== -1) {
          selectedButtons.value[index] = matchingButtonIndex;
        }
      }
    });
  }
  }
};

watch(cardData, () => {
  initializeSelectedImagesAndButtons();
});

//



/* calc */ 

const calcPrice = () => {
  if (!cardData.value || !cardData.value.variants || !cardData.value.variants.defAttr || !cardData.value.variants.propinfo) {
    if (cardData.value.variants == "No SKU property available") {
      let finalPrice = cardData.value.discountPrice != "No discount Price" || cardData.value.price;
      const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
      let totalPrice = finalPrice + shippingCost;
      let usdPrice = 226;
    if (totalPrice < 3) {
      finalPrice = finalPrice * usdPrice + 100
    } else if (totalPrice < 5) {
      finalPrice = finalPrice * usdPrice + 150
    } else if (totalPrice < 11) {
      finalPrice = finalPrice * usdPrice + 300
    } else if (totalPrice < 15) {
      finalPrice = finalPrice * usdPrice + 400
    } else if (totalPrice < 18) {
      finalPrice = finalPrice * usdPrice + 500
    } else if (totalPrice < 22) {
      finalPrice = finalPrice * usdPrice + 600
    } else if (totalPrice < 25) {
      finalPrice = finalPrice * usdPrice + 700
    } else if (totalPrice < 28) {
      finalPrice = finalPrice * usdPrice + 800
    } else if (totalPrice < 31) {
      finalPrice = finalPrice * usdPrice + 900
    } else if (totalPrice < 36) {
      finalPrice = finalPrice * usdPrice + 1000
    } else if (totalPrice < 40) {
      finalPrice = finalPrice * usdPrice + 1200
    } else if (totalPrice < 48) {
      finalPrice = finalPrice * usdPrice + 1300
    } else if (totalPrice < 60) {
      finalPrice = finalPrice * usdPrice + 1400
    } else if (totalPrice < 80) {
      finalPrice = finalPrice * usdPrice + 1500
    } else if (totalPrice < 100) {
      finalPrice = finalPrice * usdPrice + 1800
    } else if (totalPrice < 120) {
      finalPrice = finalPrice * usdPrice + 2200
    } else if (totalPrice < 160) {
      finalPrice = finalPrice * usdPrice + 2500
    } else if (totalPrice < 200) {
      finalPrice = finalPrice * usdPrice + 2700
    } else if (totalPrice > 200) {
      finalPrice = finalPrice * usdPrice + 2900
    }
      //console.log(totalPrice)
      // Math.round((totalPrice + 50 / 2) / 50) * 50
      // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
      const one = Math.round((finalPrice + 50 / 2) / 50) * 50;
      return `${one * items.value} DZD`;
    }
    return 'Price not available';
  }

  const requiredAttributes = cardData.value.variants.defAttr.split(';').map(pair => pair.split(':')[1]);
  
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    const propAttributes = prop.attr.split(';').map(pair => pair.split(':')[1]);
    return requiredAttributes.every(attr => propAttributes.includes(attr));
  });

  if (matchingPropInfo) {
    let finalPrice = matchingPropInfo.price;

    const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
    
    let totalPrice = finalPrice + shippingCost;

    let usdPrice = 226;
    if (totalPrice < 3) {
      finalPrice = finalPrice * usdPrice + 100
    } else if (totalPrice < 5) {
      finalPrice = finalPrice * usdPrice + 150
    } else if (totalPrice < 11) {
      finalPrice = finalPrice * usdPrice + 300
    } else if (totalPrice < 15) {
      finalPrice = finalPrice * usdPrice + 400
    } else if (totalPrice < 18) {
      finalPrice = finalPrice * usdPrice + 500
    } else if (totalPrice < 22) {
      finalPrice = finalPrice * usdPrice + 600
    } else if (totalPrice < 25) {
      finalPrice = finalPrice * usdPrice + 700
    } else if (totalPrice < 28) {
      finalPrice = finalPrice * usdPrice + 800
    } else if (totalPrice < 31) {
      finalPrice = finalPrice * usdPrice + 900
    } else if (totalPrice < 36) {
      finalPrice = finalPrice * usdPrice + 1000
    } else if (totalPrice < 40) {
      finalPrice = finalPrice * usdPrice + 1200
    } else if (totalPrice < 48) {
      finalPrice = finalPrice * usdPrice + 1300
    } else if (totalPrice < 60) {
      finalPrice = finalPrice * usdPrice + 1400
    } else if (totalPrice < 80) {
      finalPrice = finalPrice * usdPrice + 1500
    } else if (totalPrice < 100) {
      finalPrice = finalPrice * usdPrice + 1800
    } else if (totalPrice < 120) {
      finalPrice = finalPrice * usdPrice + 2200
    } else if (totalPrice < 160) {
      finalPrice = finalPrice * usdPrice + 2500
    } else if (totalPrice < 200) {
      finalPrice = finalPrice * usdPrice + 2700
    } else if (totalPrice > 200) {
      finalPrice = finalPrice * usdPrice + 2900
    }
    //console.log(totalPrice)
    // Math.round((totalPrice + 50 / 2) / 50) * 50
    // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
    const one = Math.round((finalPrice + 50 / 2) / 50) * 50;
    return `${one * items.value} DZD`;
  } else {
    return 'Price not available';
  }
};

const calcShipping = () => {
  if (!cardData.value || !cardData.value.variants || !cardData.value.variants.defAttr || !cardData.value.variants.propinfo) {
    if (cardData.value.variants == "No SKU property available") {
      if (cardData.value.shipping == "Free Shipping") {
        return "(شحن مجاني)";
      } else {
        const finalPrice = cardData.value.discountPrice != "No discount Price" || cardData.value.price;
        let shippingCost = cardData.value.shipping;
        let usdPrice = 226;
        let totalPrice = finalPrice + cardData.value.shipping * usdPrice;

        return `${Math.round((totalPrice + 50 / 2) / 50) * 50} DZD (سعر الشحن)`;
      }
    }
    return 'Price not available';
  }

  const requiredAttributes = cardData.value.variants.defAttr.split(';').map(pair => pair.split(':')[1]);
  
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    const propAttributes = prop.attr.split(';').map(pair => pair.split(':')[1]);
    return requiredAttributes.every(attr => propAttributes.includes(attr));
  });

  if (cardData.value.shipping == "Free Shipping") {
    return "(شحن مجاني)";
  } else {
    const finalPrice = matchingPropInfo.price;
    let shippingCost = cardData.value.shipping;
    let usdPrice = 226;
    let totalPrice = finalPrice + cardData.value.shipping * usdPrice;

    return `${Math.round((totalPrice + 50 / 2) / 50) * 50} DZD`;
  }
};

const calcTotal = () => {
  if (!cardData.value || !cardData.value.variants || !cardData.value.variants.defAttr || !cardData.value.variants.propinfo) {
    if (cardData.value.variants == "No SKU property available") {
      let finalPrice = cardData.value.discountPrice != "No discount Price" || cardData.value.price;
      const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
      let totalPrice = finalPrice + shippingCost;
      let usdPrice = 226;
    if (totalPrice < 3) {
      finalPrice = finalPrice * usdPrice + 100
    } else if (totalPrice < 5) {
      finalPrice = finalPrice * usdPrice + 150
    } else if (totalPrice < 11) {
      finalPrice = finalPrice * usdPrice + 300
    } else if (totalPrice < 15) {
      finalPrice = finalPrice * usdPrice + 400
    } else if (totalPrice < 18) {
      finalPrice = finalPrice * usdPrice + 500
    } else if (totalPrice < 22) {
      finalPrice = finalPrice * usdPrice + 600
    } else if (totalPrice < 25) {
      finalPrice = finalPrice * usdPrice + 700
    } else if (totalPrice < 28) {
      finalPrice = finalPrice * usdPrice + 800
    } else if (totalPrice < 31) {
      finalPrice = finalPrice * usdPrice + 900
    } else if (totalPrice < 36) {
      finalPrice = finalPrice * usdPrice + 1000
    } else if (totalPrice < 40) {
      finalPrice = finalPrice * usdPrice + 1200
    } else if (totalPrice < 48) {
      finalPrice = finalPrice * usdPrice + 1300
    } else if (totalPrice < 60) {
      finalPrice = finalPrice * usdPrice + 1400
    } else if (totalPrice < 80) {
      finalPrice = finalPrice * usdPrice + 1500
    } else if (totalPrice < 100) {
      finalPrice = finalPrice * usdPrice + 1800
    } else if (totalPrice < 120) {
      finalPrice = finalPrice * usdPrice + 2200
    } else if (totalPrice < 160) {
      finalPrice = finalPrice * usdPrice + 2500
    } else if (totalPrice < 200) {
      finalPrice = finalPrice * usdPrice + 2700
    } else if (totalPrice > 200) {
      finalPrice = finalPrice * usdPrice + 2900
    }
      //console.log(totalPrice)
      // Math.round((totalPrice + 50 / 2) / 50) * 50
      // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
      const one = Math.round((finalPrice + 50 / 2) / 50) * 50;
      return `${one * items.value} DZD`;
    }
    return 'Price not available';
  }

  const requiredAttributes = cardData.value.variants.defAttr.split(';').map(pair => pair.split(':')[1]);
  
  const matchingPropInfo = cardData.value.variants.propinfo.find(prop => {
    const propAttributes = prop.attr.split(';').map(pair => pair.split(':')[1]);
    return requiredAttributes.every(attr => propAttributes.includes(attr));
  });

  if (matchingPropInfo) {

    let finalPrice = matchingPropInfo.price;

    const shippingCost = cardData.value.shipping == 'Free Shipping' ? 0 : cardData.value.shipping;
    
    let totalPrice = finalPrice + shippingCost;
    let usdPrice = 226;
    if (totalPrice < 3) {
      totalPrice = totalPrice * usdPrice + 100
    } else if (totalPrice < 5) {
      totalPrice = totalPrice * usdPrice + 150
    } else if (totalPrice < 11) {
      totalPrice = totalPrice * usdPrice + 300
    } else if (totalPrice < 15) {
      totalPrice = totalPrice * usdPrice + 400
    } else if (totalPrice < 18) {
      totalPrice = totalPrice * usdPrice + 500
    } else if (totalPrice < 22) {
      totalPrice = totalPrice * usdPrice + 600
    } else if (totalPrice < 25) {
      totalPrice = totalPrice * usdPrice + 700
    } else if (totalPrice < 28) {
      totalPrice = totalPrice * usdPrice + 800
    } else if (totalPrice < 31) {
      totalPrice = totalPrice * usdPrice + 900
    } else if (totalPrice < 36) {
      totalPrice = totalPrice * usdPrice + 1000
    } else if (totalPrice < 40) {
      totalPrice = totalPrice * usdPrice + 1200
    } else if (totalPrice < 48) {
      totalPrice = totalPrice * usdPrice + 1300
    } else if (totalPrice < 60) {
      totalPrice = totalPrice * usdPrice + 1400
    } else if (totalPrice < 80) {
      totalPrice = totalPrice * usdPrice + 1500
    } else if (totalPrice < 100) {
      totalPrice = totalPrice * usdPrice + 1800
    } else if (totalPrice < 120) {
      totalPrice = totalPrice * usdPrice + 2200
    } else if (totalPrice < 160) {
      totalPrice = totalPrice * usdPrice + 2500
    } else if (totalPrice < 200) {
      totalPrice = totalPrice * usdPrice + 2700
    } else if (totalPrice > 200) {
      totalPrice = totalPrice * usdPrice + 2900
    }
    //console.log(totalPrice)
    // Math.round((totalPrice + 50 / 2) / 50) * 50
    // (${cardData.value.shipping == 'Free Shipping' ? 'شحن مجاني' : 'مع الشحن'})
    const one = Math.round((totalPrice + 50 / 2) / 50) * 50;
    return `${one * items.value} DZD`;
  } else {
    return 'Price not available';
  }
};
///////


const extractURL = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const numberRegex = /^\d+$/;
        if (numberRegex.test(text)) {
            return text;
        } else {
            const matches = text.match(urlRegex);
            if (matches && matches.length > 0) {
                return matches[0]; // Return the extracted URL
            } else {
                return null; // No URL found
            } 
        }
    };
    
const searchClicked = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await useFetch('/api/get', {
      query: { url: extractURL(searchQuery.value) },
    });

    if (data) {
      cardData.value = {
        ...data.value.details,
      };
    } else if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    isLoading.value = false;
  }
};



useSeoMeta({
  title: 'Echrili Store',
  ogTitle: 'Echrili Store | Shop from AliExpress using 🇩🇿 Dinar!',
  description: 'Shop from AliExpress using 🇩🇿 Dinar!',
  ogDescription: 'Shop from AliExpress using 🇩🇿 Dinar!',
  ogImage: 'https://i.ibb.co/8xnDMGG/Manfaat-Toko-Online.jpg',
})

</script>

<style scoped>

/* Font  */
*{
  font-family: 'Cairo', sans-serif;
}
/* Font  */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
.bg-svg-background {
  background-image: url('/back.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}

/* Start Header  */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px;
}
.header img {
  width: 80px;
}
.header h1 {
  font-size: 25px;
  font-weight: bold;
  margin-left: 20px;
}

/* End Header  */

.more-s img {
    width: 700px;
}
  
  @media (max-width: 768px)  {
    .more-s {
      display: flex;
      flex-direction: column;
     
    }
    .more-s img {
      width: 400px;
      
    }
    
    .more-s h1 {
      
      font-size: 20px;
    }
    .more-s h3{
      font-size: 15px;
    }
 }
 /* اضافة فراغ بين عناصر جدول  */
 table {
  border-collapse: separate;
  border-spacing: 10px; /* قيمة الفراغ بين الخلايا */
}

td, th {
  padding: 10px; /* تعيين تباعد داخلي إذا كنت بحاجة إلى مزيد من التحكم في المسافات الداخلية للخلية */
  border: 1px solid #ddd; /* إضافة حدود للخلايا للتأكد من وجود فراغ بينها */
}
 /* اضافة فراغ بين عناصر جدول  */

</style>