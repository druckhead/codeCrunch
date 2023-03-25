from http import HTTPStatus
import json
from django.test import RequestFactory, TestCase
from rest_framework.test import APIClient, force_authenticate

from ..models import Company, Job, User
from ..views.JobViews import JobViewSet


class JobViewSetTest(TestCase):
    def setUp(self) -> None:
        self.factory = RequestFactory()
        self.user = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        self.company = Company.objects.create(name="Microsoft", country="Israel")

    def test__get_job_viewset(self):
        pass

    def test_post_job_viewset(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        data = json.dumps(
            {"title": "Fullstack", "seniority": "Junior", "company_name": "Microsoft"}
        )
        response = client.post(
            "/api/v1/jobs",
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)

        j1 = Job.objects.filter(title="Fullstack", seniority="Junior").first()
        self.assertTrue(isinstance(j1, Job))
        self.assertEqual(j1.company.all().first().name, "Microsoft")
        self.assertEqual(j1.company.all().first().country, "Israel")
