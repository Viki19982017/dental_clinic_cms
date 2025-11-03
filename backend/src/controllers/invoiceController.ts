import { Request, Response } from 'express';
import { Invoice, Patient, Treatment } from '../models';

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { patientId, paymentStatus } = req.query;
    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = patientId;
    }
    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }

    const invoices = await Invoice.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Treatment, as: 'treatment' }
      ],
      order: [['invoiceDate', 'DESC']]
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Treatment, as: 'treatment' }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    // Generate invoice number
    const lastInvoice = await Invoice.findOne({
      order: [['createdAt', 'DESC']]
    });

    let invoiceNumber = 'INV-0001';
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
    }

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      balanceAmount: req.body.totalAmount - (req.body.paidAmount || 0)
    };

    const invoice = await Invoice.create(invoiceData);
    const fullInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Treatment, as: 'treatment' }
      ]
    });
    res.status(201).json(fullInvoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Recalculate balance
    const updatedData = {
      ...req.body,
      balanceAmount: (req.body.totalAmount || invoice.totalAmount) - (req.body.paidAmount || invoice.paidAmount)
    };

    // Update payment status based on balance
    if (updatedData.balanceAmount === 0) {
      updatedData.paymentStatus = 'Paid';
    } else if (updatedData.balanceAmount < (req.body.totalAmount || invoice.totalAmount)) {
      updatedData.paymentStatus = 'Partially Paid';
    }

    await invoice.update(updatedData);
    const updatedInvoice = await Invoice.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Treatment, as: 'treatment' }
      ]
    });
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

