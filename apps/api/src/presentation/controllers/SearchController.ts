import type { Router } from "express";
import type { SearchService } from "../../application/SearchService";
import { sendResponse } from "../http/sendResponse";

export class SearchController {
  constructor(private readonly search: SearchService) {}

  register(router: Router): void {
    router.get("/search", (request, response) => {
      sendResponse(response, this.search.search(String(request.query.q ?? "")));
    });
  }
}
