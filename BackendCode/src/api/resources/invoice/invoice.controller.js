import Invoice from "./invoice.models";
import HttpServerCodes from "http-status-codes";
import Joi from "joi";
import Client from "../client/client.models";

export default {
  findAll(req, res, next) {
    console.log("inside findAll");
    const { page = 1, limit = 10, filter, sortItem, sortOrder } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: "client"
    };
    let query = {};
    if (filter) {
      query.item = {
        $regex: filter
      };
    }
    if (sortItem && sortOrder) {
      options.sort = {
        [sortItem]: sortOrder
      };
    }
    console.log(options);
    Invoice.paginate(query, options)
      .then(invoices => res.json(invoices))
      .catch(err => {
        return res.status(HttpServerCodes.INTERNAL_SERVER_ERROR).json(err);
      });
  },
  create(req, res, next) {
    console.log("inside create", req.body);
    // let error = new Error({ message: 'error from create' });
    // error.status = 404;
    // next(error);
    // let { item, qty, date, due, tax, rate } = req.body;

    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      tax: Joi.number().optional(),
      rate: Joi.date().required(),
      qty: Joi.number().required(),
      client: Joi.string().required()
    });

    const { error, value } = Joi.validate(req.body, schema);
    // console.log('value of req', value);
    if (error && error.details) {
      return res.status(HttpServerCodes.BAD_REQUEST).json(error);
    }

    Invoice.create(value)
      .then(invoice => {
        res.json(invoice);
      })
      .catch(err => {
        res.status(HttpServerCodes.INTERNAL_SERVER_ERROR).json({ err: "error while inserting data" });
      });
  },
  findOne(req, res) {
    const { id } = req.params;
    Invoice.findById(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpServerCodes.NOT_FOUND).json({ err: "could not find any voice" });
        }
        return res.json(invoice);
      })
      .catch(err => {
        res.status(HttpServerCodes.INTERNAL_SERVER_ERROR).json({ err: "error while inserting data" });
      });
  },
  deleteRecord(req, res) {
    const { id } = req.params;
    Invoice.findByIdAndDelete(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpServerCodes.NOT_FOUND).json({ err: "could not find the record" });
        }
        return res.json(invoice);
      })
      .catch(err => {
        res.status(HttpServerCodes.INTERNAL_SERVER_ERROR).json({ err: "error while inserting data" });
      });
  },
  update(req, res) {
    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      tax: Joi.number().optional(),
      rate: Joi.date().optional(),
      qty: Joi.number().optional(),
      client: Joi.string().optional()
    });
    const { id } = req.params;
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpServerCodes.BAD_REQUEST).json(error);
    }
    Invoice.findOneAndUpdate({ _id: id }, value, { new: true })
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpServerCodes.NOT_FOUND).json({ err: "could not find the record" });
        }
        return res.json(invoice);
      })
      .catch(err => {
        res.status(HttpServerCodes.INTERNAL_SERVER_ERROR).json({ err: "error while updating data" });
      });
  }
};
