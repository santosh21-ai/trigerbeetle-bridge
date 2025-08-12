// tigerbeetle-bridge.js (Node.js service)
// import express from "express";
const express = require("express");
const { createClient } = require("tigerbeetle-node");

// import { createClient } from "tigerbeetle-node";

const app = express();
app.use(express.json());

// Create TigerBeetle client
const client = createClient({
  cluster_id: 0n,
  replica_addresses: ["3000"],
});

// Create accounts endpoint
app.post("/accounts", async (req, res) => {
  console.log("Body: ", req.body);
  try {
    const accounts = req.body.map((acc) => ({
      id: BigInt(acc.id),
      debits_pending: 0n,
      debits_posted: 0n,
      credits_pending: 0n,
      credits_posted: 0n,
      user_data_128: 0n,
      user_data_64: 0n,
      user_data_32: 0,
      reserved: 0,
      ledger: acc.ledger,
      code: acc.code,
      flags: acc.flags || 0,
      timestamp: 0n,
    }));

    const result = await client.createAccounts(accounts);
    res.json({ success: result.length === 0, errors: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lookup accounts endpoint
app.post("/accounts/lookup", async (req, res) => {
  try {
    const accountIds = req.body.map((id) => BigInt(id));
    const accounts = await client.lookupAccounts(accountIds);

    // Convert BigInt values to strings for JSON serialization
    const serializedAccounts = accounts.map((acc) => ({
      ...acc,
      id: acc.id.toString(),
      debits_pending: acc.debits_pending.toString(),
      debits_posted: acc.debits_posted.toString(),
      credits_pending: acc.credits_pending.toString(),
      credits_posted: acc.credits_posted.toString(),
      user_data_128: acc.user_data_128.toString(),
      user_data_64: acc.user_data_64.toString(),
      timestamp: acc.timestamp.toString(),
    }));

    res.json({ success: true, accounts: serializedAccounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create transfers endpoint
app.post("/transfers", async (req, res) => {
  try {
    const transfers = req.body.map((transfer) => ({
      id: BigInt(transfer.id),
      debit_account_id: BigInt(transfer.debit_account_id),
      credit_account_id: BigInt(transfer.credit_account_id),
      amount: BigInt(transfer.amount),
      pending_id: 0n,
      user_data_128: 0n,
      user_data_64: 0n,
      user_data_32: 0,
      timeout: 0,
      ledger: transfer.ledger,
      code: transfer.code,
      flags: transfer.flags || 0,
      timestamp: 0n,
    }));

    const result = await client.createTransfers(transfers);
    res.json({ success: result.length === 0, errors: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lookup transfers endpoint
app.post("/transfers/lookup", async (req, res) => {
  try {
    const transferIds = req.body.map((id) => BigInt(id));
    const transfers = await client.lookupTransfers(transferIds);

    // Convert BigInt values to strings for JSON serialization
    const serializedTransfers = transfers.map((transfer) => ({
      ...transfer,
      id: transfer.id.toString(),
      debit_account_id: transfer.debit_account_id.toString(),
      credit_account_id: transfer.credit_account_id.toString(),
      amount: transfer.amount.toString(),
      pending_id: transfer.pending_id.toString(),
      user_data_128: transfer.user_data_128.toString(),
      user_data_64: transfer.user_data_64.toString(),
      timestamp: transfer.timestamp.toString(),
    }));

    res.json({ success: true, transfers: serializedTransfers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3002, () => {
  console.log("TigerBeetle bridge service running on port 3002");
});
