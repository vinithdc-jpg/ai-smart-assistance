"use client";

import { useCallback, useEffect, useState } from "react";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30_000;
const STORAGE_PREFIX = "smart-ledger-login-lockout:";

interface LockoutRecord {
  attempts: number;
  lockedUntil: number;
  lockoutCount: number;
}

function emptyRecord(): LockoutRecord {
  return { attempts: 0, lockedUntil: 0, lockoutCount: 0 };
}

function getStorageKey(scope: string, account: string) {
  return `${STORAGE_PREFIX}${scope}:${account.trim().toLowerCase()}`;
}

function getActiveAccountStorageKey(scope: string) {
  return `${STORAGE_PREFIX}${scope}:active-account`;
}

function clearActiveAccount(scope: string, account: string) {
  const activeAccountKey = getActiveAccountStorageKey(scope);
  if (localStorage.getItem(activeAccountKey) === account.trim().toLowerCase()) {
    localStorage.removeItem(activeAccountKey);
  }
}

function readRecord(key: string): LockoutRecord {
  const stored = localStorage.getItem(key);
  if (!stored) return emptyRecord();

  try {
    const record: unknown = JSON.parse(stored);
    if (
      typeof record === "object" &&
      record !== null &&
      "attempts" in record &&
      "lockedUntil" in record &&
      typeof record.attempts === "number" &&
      typeof record.lockedUntil === "number"
    ) {
      return {
        attempts: record.attempts,
        lockedUntil: record.lockedUntil,
        lockoutCount:
          "lockoutCount" in record &&
          typeof record.lockoutCount === "number" &&
          record.lockoutCount >= 0
            ? record.lockoutCount
            : 0,
      };
    }
  } catch {
    localStorage.removeItem(key);
  }

  return emptyRecord();
}

function getRemainingSeconds(lockedUntil: number) {
  return Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
}

export default function useLoginLockout(scope: string, account: string) {
  const [restoredAccount, setRestoredAccount] = useState("");
  const accountId = account.trim() || restoredAccount;
  const key = getStorageKey(scope, accountId);
  const [lockoutState, setLockoutState] = useState({
    key,
    remainingSeconds: 0,
  });
  const remainingSeconds =
    lockoutState.key === key ? lockoutState.remainingSeconds : 0;

  const refreshLockout = useCallback(() => {
    const record = readRecord(key);
    const remaining = getRemainingSeconds(record.lockedUntil);

    if (record.lockedUntil > 0 && remaining === 0) {
      localStorage.setItem(
        key,
        JSON.stringify({ ...record, attempts: 0, lockedUntil: 0 }),
      );
      clearActiveAccount(scope, accountId);
    }

    setLockoutState({ key, remainingSeconds: remaining });
  }, [accountId, key, scope]);

  const getCurrentLockoutSeconds = useCallback(() => {
    const activeAccount =
      accountId ||
      localStorage.getItem(getActiveAccountStorageKey(scope)) ||
      "";
    if (!accountId && activeAccount) setRestoredAccount(activeAccount);

    const activeKey = getStorageKey(scope, activeAccount);
    const record = readRecord(activeKey);
    const remaining = getRemainingSeconds(record.lockedUntil);
    if (record.lockedUntil > 0 && remaining === 0) {
      localStorage.setItem(
        activeKey,
        JSON.stringify({ ...record, attempts: 0, lockedUntil: 0 }),
      );
      clearActiveAccount(scope, activeAccount);
    }
    setLockoutState({ key: activeKey, remainingSeconds: remaining });
    return remaining;
  }, [accountId, scope]);

  useEffect(() => {
    if (!account.trim() && !restoredAccount) {
      const restoreAccountId = window.setTimeout(() => {
        const savedAccount = localStorage.getItem(
          getActiveAccountStorageKey(scope),
        );
        if (savedAccount) setRestoredAccount(savedAccount);
      }, 0);
      return () => window.clearTimeout(restoreAccountId);
    }

    const initialSyncId = window.setTimeout(refreshLockout, 0);

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) refreshLockout();
    };
    window.addEventListener("storage", onStorage);
    const intervalId = window.setInterval(refreshLockout, 1000);

    return () => {
      window.clearTimeout(initialSyncId);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(intervalId);
    };
  }, [account, key, refreshLockout, restoredAccount, scope]);

  const recordFailedAttempt = useCallback(() => {
    const record = readRecord(key);
    const remaining = getRemainingSeconds(record.lockedUntil);
    if (remaining > 0) {
      setLockoutState({ key, remainingSeconds: remaining });
      return remaining;
    }

    const previousLockoutExpired =
      record.lockedUntil > 0 && remaining === 0;
    const attempts = previousLockoutExpired ? 1 : record.attempts + 1;
    const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
    const lockoutDuration =
      LOCKOUT_DURATION_MS * 2 ** record.lockoutCount;
    const lockoutCount = shouldLock
      ? record.lockoutCount + 1
      : record.lockoutCount;
    const lockedUntil = shouldLock ? Date.now() + lockoutDuration : 0;

    localStorage.setItem(
      key,
      JSON.stringify({ attempts, lockedUntil, lockoutCount }),
    );
    if (shouldLock && accountId) {
      localStorage.setItem(
        getActiveAccountStorageKey(scope),
        accountId.trim().toLowerCase(),
      );
    }
    setLockoutState({
      key,
      remainingSeconds: getRemainingSeconds(lockedUntil),
    });
    return getRemainingSeconds(lockedUntil);
  }, [accountId, key, scope]);

  const resetAttempts = useCallback(() => {
    localStorage.removeItem(key);
    clearActiveAccount(scope, accountId);
    setLockoutState({ key, remainingSeconds: 0 });
  }, [accountId, key, scope]);

  return {
    remainingSeconds,
    getCurrentLockoutSeconds,
    recordFailedAttempt,
    resetAttempts,
  };
}
