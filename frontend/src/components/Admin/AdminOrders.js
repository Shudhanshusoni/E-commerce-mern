import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid"; 
import "./AdminProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/OrderAction";
import { DELETE_ORDER_RESET } from "../../constants/OrderConstant";
import { Typography } from "@mui/material";
import Loader from "../layout/Loader/Loader";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const navigate=useNavigate();

  const { loading ,error, orders } = useSelector((state) => state.allOrders);

  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 220, flex: 0.8 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "green"
          : "red";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/orders/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <>
     {loading ? (
        <Loader />
      ) : (
        <>
        <MetaData title={`ALL ORDERS - Admin`} />

        <div className="dashboard">
          <SideBar />
         { orders && orders.length === 0 ? 
          (
          <div className="NoOrders">
          <ProductionQuantityLimitsIcon />

          <Typography>No Pending Order of Products </Typography>
          </div>
          ):(
          <div className="productListContainer">
            <h1 id="productListHeading">ALL ORDERS</h1>
  
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          </div>
           )}
           
        </div>
        </>
  )}
    </>
  );
};

export default AdminOrders;