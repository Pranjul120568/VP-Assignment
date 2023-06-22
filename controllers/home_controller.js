const data = require("../data/data");
module.exports.total_item_api = async function (req, res) {
  try {
    let totalSeats = 0;
    const department = req.query.department;
    const startDate = req.query.startDate + "T00:00:00.000+00:00";
    const endDate = req.query.endDate + "T00:00:00.000+00:00";

    // Null checks for startDate and endDate
    if (!startDate) {
      return res.json({ msg: "startDate not provided" });
    }
    if (!endDate) {
      return res.json({ msg: "endDate not provided" });
    }

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];

      // Check if the department and date fall within the given range
      if (
        obj.department === department &&
        new Date(obj.date) >= new Date(startDate) &&
        new Date(obj.date) <= new Date(endDate)
      ) {
        totalSeats += obj.seats;
      }
    }

    return res.status(200).json({
      totalSeats: totalSeats,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err: err,
    });
  }
};

module.exports.nth_most_total_item_api = async function (req, res) {
  try {
    let totalSeats = 0;
    const itemBy = req.query.itemBy;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const n = req.query.n;

    // Null checks for startDate, endDate, and n
    if (!startDate) {
      return res.json({ msg: "startDate not provided" });
    }
    if (!endDate) {
      return res.json({ msg: "endDate not provided" });
    }
    if (!n) {
      return res.json({ msg: "nth not provided" });
    }
    if (!itemBy) {
      return res.json({ msg: "parameter to sort not provided" });
    }

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    console.log(filteredData.length);

    let sortedData;
    if (itemBy === "quantity") {
      sortedData = filteredData.sort((a, b) => b.seats - a.seats);
    } else if (itemBy === "price") {
      sortedData = filteredData.sort((a, b) => b.amount - a.amount);
    } else {
      return res.status(400).json({ error: "Invalid item_by parameter" });
    }

    console.log(sortedData);

    if (n > sortedData.length || n < 1) {
      return res.status(400).json({ error: "Invalid n parameter" });
    }

    const nthItem = sortedData[n - 1].software;
    return res.json({ nth_most_total_item: nthItem });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err: err,
    });
  }
};

module.exports.percentage_of_department_wise_sold_item_api = async function (
  req,
  res
) {
  try {
    const itemBy = req.query.itemBy;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Null checks for startDate and endDate
    if (!startDate) {
      return res.json({ msg: "startDate not provided" });
    }
    if (!endDate) {
      return res.json({ msg: "endDate not provided" });
    }

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    // Calculate the total sold seats for each department
    const departmentSeats = {};
    let totalSeats = 0;

    filteredData.forEach((item) => {
      const { department, seats } = item;
      if (department in departmentSeats) {
        departmentSeats[department] += seats;
      } else {
        departmentSeats[department] = seats;
      }
      totalSeats += seats;
    });

    // Calculate the percentage of sold seats department-wise
    const departmentPercentages = {};
    for (const department in departmentSeats) {
      const percentage = (
        (departmentSeats[department] / totalSeats) *
        100
      ).toFixed(2);
      departmentPercentages[department] = `${percentage}%`;
    }

    return res.json({ departmentPercentages: departmentPercentages });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err: err,
    });
  }
};

module.exports.monthly_sales_api = async function (req, res) {
  try {
    const product = req.query.product;
    const year = req.query.year;
    if (!product) {
      return res.json({
        msg: "product not provided",
      });
    }
    if (!year) {
      return res.json({
        msg: "year not provided",
      });
    }
    const filteredData = data.filter((item) => {
      const itemYear = new Date(item.date).getFullYear().toString();
      const itemMonth = new Date(item.date).getMonth() + 1; // Months are zero-based
      return (
        itemYear == year &&
        item.software.toLowerCase() === product.toLowerCase()
      );
    });
    // Group the sales by month
    const monthlySales = new Array(12).fill(0);
    filteredData.forEach((item) => {
      const itemMonth = new Date(item.date).getMonth();
      monthlySales[itemMonth] += item.amount;
    });
    return res.json({ monthlySales: monthlySales });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err: err,
    });
  }
};
