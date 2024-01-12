<template>
    <div class="bg-svg-background flex flex-col items-center p-6">
      <!-- Green title box -->
      <div class="mb-6 bg-green-600 text-white py-3 px-4 rounded-lg text-lg font-bold">ضبط العمولة</div>
      <!-- Responsive table form with rounded corners -->
      <div class="overflow-x-auto rounded-lg">
        <table class="min-w-full table-auto rounded-lg bg-white">
          <thead>
            <tr>
              <th class="px-4 py-2">القيمة $</th>
              <th class="px-4 py-2">العمولة DZA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in values" :key="key">
              <td class="border px-4 py-2">{{ item.value }}</td>
              <td class="border px-4 py-2">
                <input v-model="item.rate" @input="validateInput(item)" type="text" class="border rounded py-1 px-2 w-full" />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          @click="saveData"
          class="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          حفظ
        </button>
        <div v-if="successMessage" class="text-center text-green-600 mt-2">!تم حفظ الأسعار الجديدة</div>
      </div>
    </div>
  </template>
  
<script setup>
import values from '~/assets/rates.json';
  
const updatedValues = ref([...values]);
const successMessage = ref('');

const saveData = async () => {
    try {
        const requestData = updatedValues.value.map(item => ({
        value: item.value,
        rate: parseInt(item.rate),
      }));
  
      const response = await $fetch('/api/rateset', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });
  
      if (response.ok) {
        successMessage.value = 'Rates updated successfully!';
      } else {
        console.error('Failed to update rates');
      }
    } catch (error) {
      console.error('Error updating rates:', error);
    }
  };

  const validateInput = (item) => {
  const newValue = item.rate.replace(/\D/g, '').slice(0, 3); // Remove non-numeric characters and limit to 3 digits
  item.rate = newValue; // Update the input value
};
</script>  
  
  
<style>
  /* Add responsiveness for mobile devices */
  @media(max-width: 768px) {
    table {
      overflow-x: auto;
      display: block;
      width: 100%;
    }
    td, th {
      padding: 6px;
      display: block;
      text-align: left;
    }
    th {
      text-align: center;
    }
  }
  
  .bg-svg-background {
    background-image: url('/back.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
  }
  </style>
  