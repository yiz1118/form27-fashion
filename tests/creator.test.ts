import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { CreatorCredit } from "../components/CreatorCredit";
import { creator } from "../config/creator";

test("portfolio CTA stays hidden until a real URL is configured", () => {
  const originalURL = creator.portfolioUrl;
  try {
    creator.portfolioUrl = null;
    assert.doesNotMatch(renderToStaticMarkup(createElement(CreatorCredit)), /View Portfolio/);
    creator.portfolioUrl = "https://portfolio.example";
    const configured = renderToStaticMarkup(createElement(CreatorCredit));
    assert.match(configured, /View Portfolio/);
    assert.match(configured, /href="https:\/\/portfolio.example"/);
    assert.match(configured, /data-analytics-event="creator_portfolio"/);
  } finally {
    creator.portfolioUrl = originalURL;
  }
});
