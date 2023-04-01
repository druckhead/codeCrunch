import json
from http import HTTPStatus

from rest_framework.test import APIClient, APIRequestFactory, APITestCase

from ..models import Company, Job, Post, PostSolution, User


class UserViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.client = APIClient()
        cls.factory = APIRequestFactory()
        cls.admin = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        cls.user = User.objects.create_user(
            username="danielraz", email="danielraz@raz.com", password="damndaniel"
        )

    def test_get_retrieve_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/v1/users/" + str(self.user.id))
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("username"), "danielraz")
        self.assertEqual(response.data.get("email"), "danielraz@raz.com")
        self.assertEqual(response.data.get("id"), self.user.id)

    def test_get_retrieve_curr_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/users/" + str(self.user.id))
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("username"), "danielraz")
        self.assertEqual(response.data.get("email"), "danielraz@raz.com")
        self.assertEqual(response.data.get("id"), self.user.id)

    def test_get_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/v1/users")
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(2, len(response.data))

    def test_post_create(self):
        data = json.dumps(
            {
                "username": "lebronjames23",
                "email": "lebron@king.com",
                "password": "kingjames",
                "confirm_password": "kingjames",
                "first_name": "LeBron",
                "last_name": "James",
            }
        )
        response = self.client.post(
            "/api/v1/users", data=data, content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)
        self.assertEqual(
            response.data,
            {
                "username": "lebronjames23",
                "email": "lebron@king.com",
                "first_name": "LeBron",
                "last_name": "James",
            },
        )

    def test_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps(
            {
                "username": "lebronjames",
                "email": "lebron23@king.com",
                "password": "kingjamesking",
                "confirm_password": "kingjamesking",
                "first_name": "LeBron",
                "last_name": "James",
            }
        )
        response = self.client.put(
            "/api/v1/users/" + str(self.user.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(
            response.data,
            {
                "username": "lebronjames",
                "email": "lebron23@king.com",
                "first_name": "LeBron",
                "last_name": "James",
            },
        )

    def test_partial_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps(
            {
                "first_name": "LeBron II",
                "last_name": "James",
            }
        )
        response = self.client.patch(
            "/api/v1/users/" + str(self.user.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(
            response.data,
            {
                "username": "danielraz",
                "first_name": "LeBron II",
                "last_name": "James",
                "email": "danielraz@raz.com",
            },
        )

    def test_delete(self):
        self.assertEqual(2, len(User.objects.all()))
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/v1/users/" + str(self.user.id))
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT._value_)
        self.assertEqual(1, len(User.objects.all()))


class CompanyViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.factory = APIRequestFactory()
        cls.client = APIClient()
        cls.user = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        cls.company = Company.objects.create(
            name="Apple Inc.", country="United States of America"
        )
        cls.company2 = Company.objects.create(name="Microsoft", country="Israel")

    def test_get_retrieve(self):
        response = self.client.get("/api/v1/companies/" + str(self.company2.id))
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("name"), "Microsoft")
        self.assertEqual(response.data.get("country"), "Israel")
        self.assertEqual(response.data.get("id"), self.company2.id)

    def test_get_list(self):
        response = self.client.get("/api/v1/companies")
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        for c in response.data:
            c = Company.objects.get(pk=c.get("id"))
            self.assertTrue(isinstance(c, Company))
        self.assertEqual(response.data[0].get("name"), "Apple Inc.")
        self.assertEqual(response.data[0].get("country"), "United States of America")
        self.assertEqual(response.data[1].get("name"), "Microsoft")
        self.assertEqual(response.data[1].get("country"), "Israel")

    def test_post_create(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps({"name": "Apple Inc.", "country": "United States of America"})
        response = self.client.post(
            "/api/v1/companies", data=data, content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)

    def test_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps({"name": "SAP", "country": "Israel"})
        response = self.client.put(
            "/api/v1/companies/" + str(self.company.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data, {"name": "SAP", "country": "Israel"})
        self.company.refresh_from_db()
        self.assertEqual(self.company.name, "SAP")
        self.assertEqual(self.company.country, "Israel")

    def test_partial_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps({"name": "SAP"})
        response = self.client.patch(
            "/api/v1/companies/" + str(self.company.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(
            response.data, {"name": "SAP", "country": "United States of America"}
        )
        self.company.refresh_from_db()
        self.assertEqual(self.company.name, "SAP")
        self.assertEqual(self.company.country, "United States of America")

    def test_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/v1/companies/" + str(self.company2.id))
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT._value_)


class JobViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.factory = APIRequestFactory()
        cls.user = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        cls.company = Company.objects.create(
            name="Apple Inc.", country="United States of America"
        )
        cls.company2 = Company.objects.create(name="Microsoft", country="Israel")

    def setUp(self) -> None:
        self.job = Job.objects.create(title="DevOps Engineer", seniority="Senior")
        self.job.companies.add(self.company)

    def test_get_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/jobs/" + str(self.job.id))
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("title"), "DevOps Engineer")
        self.assertEqual(response.data.get("seniority"), "Senior")
        self.assertEqual(response.data.get("id"), self.job.id)

    def test_get_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/jobs")
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data[0].get("title"), "DevOps Engineer")
        self.assertEqual(response.data[0].get("seniority"), "Senior")
        c1_id = response.data[0].get("companies")[0]
        c1 = Company.objects.get(pk=c1_id)
        self.assertTrue(isinstance(c1, Company))
        self.assertEqual(c1.name, "Apple Inc.")
        self.assertEqual(c1.country, "United States of America")

    def test_post_create(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps(
            {
                "title": "Fullstack",
                "seniority": "Junior",
                "company_id": self.company2.id,
            }
        )
        response = self.client.post(
            "/api/v1/jobs", data=data, content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)

        j1 = Job.objects.filter(title="Fullstack", seniority="Junior").first()
        self.assertTrue(isinstance(j1, Job))
        self.assertEqual(j1.companies.all().first().name, "Microsoft")
        self.assertEqual(j1.companies.all().first().country, "Israel")

    def test_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps(
            {
                "title": "Data Analyst",
                "seniority": "Intern",
                "company_ids": [self.company.id, self.company2.id],
            }
        )
        response = self.client.put(
            "/api/v1/jobs/" + str(self.job.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(
            response.data, {"title": "Data Analyst", "seniority": "Intern"}
        )
        self.job.refresh_from_db()
        self.assertEqual(self.job.title, "Data Analyst")
        self.assertEqual(self.job.seniority, "Intern")
        self.assertEqual(self.job.companies.get(pk=self.company2.pk).name, "Microsoft")

    def test_partial_update(self):
        self.client.force_authenticate(user=self.user)
        data = json.dumps({"title": "Tree Planter"})
        response = self.client.patch(
            "/api/v1/jobs/" + str(self.job.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.job.refresh_from_db()
        self.assertEqual(self.job.title, "Tree Planter")
        data = json.dumps({"company_ids": []})
        response = self.client.patch(
            "/api/v1/jobs/" + str(self.job.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.job.refresh_from_db()
        self.assertEqual(0, len(self.job.companies.all()))

    def test_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/v1/companies/" + str(self.company.id))
        self.job.refresh_from_db()
        self.assertEqual(0, len(self.job.companies.all()))
        response = self.client.delete("/api/v1/jobs/" + str(self.job.id))
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT._value_)


class PostViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.client = APIClient()
        cls.factory = APIRequestFactory()
        cls.user = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        cls.company = Company.objects.create(
            name="Apple Inc.", country="United States of America"
        )
        cls.company2 = Company.objects.create(name="Microsoft", country="Israel")
        cls.job = Job.objects.create(title="DevOps Engineer", seniority="Senior")
        cls.job.companies.add(cls.company)
        cls.job2 = Job.objects.create(title="Fullstack Developer", seniority="Senior")
        cls.job2.companies.add(cls.company2)

    def setUp(self) -> None:
        self.post = Post.objects.create(
            post_type="question",
            title="TwoSum",
            description="TwoSum Description",
            job=self.job,
            user=self.user,
        )

        self.post2 = Post.objects.create(
            post_type="assignment",
            title="Design Twitter",
            description="Design Twitter Assignment",
            job=self.job,
            user=self.user,
        )

    def test_get_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/posts/" + str(self.post.id))
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("post_type"), "question")
        self.assertEqual(response.data.get("title"), "TwoSum")
        self.assertEqual(response.data.get("description"), "TwoSum Description")
        self.assertEqual(response.data.get("job"), self.post.job.id)

    def test_get_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/posts")
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(len(response.data), 2)

    def test_post_create(self):
        data = json.dumps(
            {
                "post_type": "assignment",
                "title": "Design Twitter",
                "description": "Design Twitter Assignment",
                "job": self.job2.id,
            }
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/v1/posts", data=data, content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)

    def test_update(self):
        data = json.dumps(
            {
                "post_type": "assignment",
                "title": "Design Facebook",
                "description": "Design Facebook Assignment",
                "job": self.job2.id,
            }
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.put(
            "/api/v1/posts/" + str(self.post.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)

    def test_partial_update(self):
        self.assertEqual(self.post.job.id, self.job.id)
        data = json.dumps({"job": self.job2.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            "/api/v1/posts/" + str(self.post.id),
            data=data,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.post.refresh_from_db()
        self.assertEqual(self.post.job.id, self.job2.id)

    def test_delete(self):
        self.assertEqual(2, len(Post.objects.all()))
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/v1/posts/" + str(self.post.id))
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT._value_)
        self.assertEqual(1, len(Post.objects.all()))


class PostSolutionViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.factory = APIRequestFactory()
        cls.user = User.objects.create_superuser(
            username="admin", email="admin@admin.com", password="damndaniel"
        )
        cls.company = Company.objects.create(
            name="Apple Inc.", country="United States of America"
        )
        cls.company2 = Company.objects.create(name="Microsoft", country="Israel")

        cls.job = Job.objects.create(title="DevOps Engineer", seniority="Senior")
        cls.job.companies.add(cls.company)

        cls.post = Post.objects.create(
            post_type="question",
            title="TwoSum",
            description="TwoSum Description",
            job=cls.job,
            user=cls.user,
        )
        cls.post2 = Post.objects.create(
            post_type="assignment",
            title="Design Twitter",
            description="Design Twitter Assignment",
            job=cls.job,
            user=cls.user,
        )

    def setUp(self) -> None:
        self.postsolution = PostSolution.objects.create(
            solution="Solution for some post", post=self.post, user=self.user
        )
        self.postsolution2 = PostSolution.objects.create(
            solution="Solution for some other post", post=self.post2, user=self.user
        )

    def test_get_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            "/api/v1/post_solutions/" + str(self.postsolution.id)
        )
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(response.data.get("id"), self.postsolution.id)

    def test_get_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/post_solutions")
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)
        self.assertEqual(2, len(response.data))
        self.assertEqual(response.data[0].get("id"), self.postsolution.id)
        self.assertEqual(response.data[1].get("id"), self.postsolution2.id)

    def test_post_create(self):
        data = json.dumps(
            {"solution": "Yet another post solution", "post": self.post.id}
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/v1/post_solutions", data=data, content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED._value_)

    def test_update(self):
        pass

    def test_partial_update(self):
        pass

    def test_delete(self):
        self.client.force_authenticate(user=self.user)
        self.assertEqual(2, len(PostSolution.objects.all()))
        response = self.client.delete(
            "/api/v1/post_solutions/" + str(self.postsolution.id)
        )
        self.job.refresh_from_db()
        self.assertEqual(1, len(PostSolution.objects.all()))
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT._value_)
