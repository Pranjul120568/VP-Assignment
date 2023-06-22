const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

// Routes for different APIs
router.get('/api/total_items', homeController.total_item_api); // Route for total_items API
router.get('/api/nth_most_total_item', homeController.nth_most_total_item_api); // Route for nth_most_total_item API
router.get('/api/percentage_of_department_wise_sold_items', homeController.percentage_of_department_wise_sold_item_api); // Route for percentage_of_department_wise_sold_items API
router.get('/api/monthly_sales', homeController.monthly_sales_api); // Route for monthly_sales API

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));

module.exports = router;
