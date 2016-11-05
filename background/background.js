"use strict";




chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  chrome.declarativeContent.onPageChanged.addRules([
    {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { urlContains: 'script.google.com' }
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }
  ]);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  if (!msg.cmd) return;
  switch(msg.cmd) {
    case "tab":
      chrome.storage.local.set({tab: sender.tab.id});
      return;
    default:
      return;
  }
});