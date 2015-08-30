import datetime
import os
import static
import time
import unittest

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from wsgi_liveserver import LiveServerTestCase


class SimpleTest(LiveServerTestCase):
    IMPLICIT_WAIT_TIME = 10

    @classmethod
    def setUpClass(cls):
        super(SimpleTest, cls).setUpClass()
        cls.driver = webdriver.Firefox()
        # Wait 10 seconds for elements to appear, always
        cls.driver.implicitly_wait(cls.IMPLICIT_WAIT_TIME)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super(SimpleTest, cls).tearDownClass()

    def create_app(self):
        return static.Cling(os.path.dirname(os.path.realpath(__file__)))

    def get(self, url):
        return self.driver.get("%s/%s" % (self.url_base(), url))

    def find(self, selector):
        '''Find element by CSS selector, eg lookup("#my_button")'''
        return self.driver.find_element_by_css_selector(selector)

    def find_all(self, selector):
        return self.driver.find_elements_by_css_selector(selector)

    def find_text(self, selector, text):
        '''Find element by CSS selector containing certain text'''
        wait = WebDriverWait(self.driver, 10)
        return wait.until(expected_conditions.text_to_be_present_in_element(
            (By.CSS_SELECTOR, selector), text
        ))

    def dont_find(self, selector, time_out=10):
        '''Check whether element exists'''
        self.driver.implicitly_wait(0)
        start_time = datetime.datetime.now()
        element_exists = True  # start in "found" state, as soon as we don't find it unset this
        if time_out:
            while (datetime.datetime.now() - start_time).seconds < time_out and element_exists:
                try:
                    element = self.find(selector)
                    if not element.is_displayed():
                        element_exists = False
                    else:
                        time.sleep(1)
                except NoSuchElementException:
                    element_exists = False
        else:
            try:
                element = self.find(selector)
                if not element.is_displayed():
                    element_exists = False
            except NoSuchElementException:
                element_exists = False
        self.driver.implicitly_wait(self.IMPLICIT_WAIT_TIME)
        return not element_exists

    def screenshot(self, name="screenshot.png"):
        '''Saves a screenshot in CircleCI's artifact storage'''
        circle_dir = os.environ.get('CIRCLE_ARTIFACTS', None)
        if circle_dir:
            self.driver.save_screenshot(os.path.join(circle_dir, name))
        else:
            self.driver.save_screenshot(name)


class HomePageSmokeTests(SimpleTest):
    def setUp(self):
        self.get('index.html')

    def test_home_page_contents(self):
        # Jumbotron message
        assert self.find_text(".jumbotron h1", "Learn to code with top local pros.")
        # Seating chart removed
        assert self.dont_find('#pricing-registration section')


if __name__ == '__main__':
    unittest.main()
