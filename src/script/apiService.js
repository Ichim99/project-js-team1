const KEY = 'N7FCeNuTwKBillrRlUtN6okNTN2WqI0N';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';


class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 0;
    this.perPage = 20;
    this.totalElements = 0;
    this.id = ' ';
    this.country = '';
  }
}