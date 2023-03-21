from django.test import TestCase

from ..models import Company, Job, Post, User


class UserModelTests(TestCase):
    def test_user_was_created(
        self,
        username="danielraz",
        first_name="Daniel",
        last_name="Raz",
        email="danielraz@gmail.com",
    ):
        user = User.objects.create(
            username=username,
            password="abc0011223344",
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        self.assertTrue(isinstance(user, User))
        self.assertTrue(user.id > 0)
        self.assertTrue(user.username, "danielraz")
        self.assertEqual(user.first_name, "Daniel")
        self.assertEqual(user.last_name, "Raz")
        self.assertEqual(user.email, "danielraz@gmail.com")


class CompanyModelTests(TestCase):
    def test_company_was_created(self, name="Microsoft", country="Israel"):
        c1 = Company.objects.create(name=name, country=country)
        self.assertTrue(isinstance(c1, Company))
        self.assertEqual(name, "Microsoft")
        self.assertEqual(country, "Israel")
        self.assertTrue(c1.id > 0)


class JobModelTests(TestCase):
    def test_job_was_created(
        self,
        title="fullstack developer",
        seniority="junior",
        name="Microsoft",
        country="Israel",
    ):
        job = Job.objects.create(title=title, seniority=seniority)
        self.assertTrue(job.id == 1)
        self.assertTrue(isinstance(job, Job))
        self.assertEqual(job.title, "fullstack developer")
        self.assertEqual(job.seniority, "junior")
        c2 = job.company.create(name=name, country=country)
        job.company.add(c2)
        self.assertEqual(job.company.get(pk=2).id, 2)


class PostModelTests(TestCase):
    def test_post_was_created(
        self,
        title="TwoSum",
        title2="Create a simple E-Commerce Shop",
        post_type="question",
        post_type2="assignment",
        description="lorem ipsum dolor",
    ):
        u1 = User.objects.create(
            username="danielraz",
            first_name="Daniel",
            last_name="Raz",
            email="danielraz@gmail.com",
        )
        u2 = User.objects.create(
            username="michaeljackson",
            first_name="Michael",
            last_name="Jackson",
            email="michaeljackson@gmail.com",
        )

        j1 = Job.objects.create(title="fullstack developer", seniority="junior")

        p1 = Post.objects.create(title=title, post_type=post_type, job=j1)
        self.assertGreaterEqual(p1.job_id, 1)
        self.assertEqual(p1.id, 1)
        self.assertEqual(p1.title, "TwoSum")
        self.assertEqual(p1.post_type, "question")
        self.assertIsNone(p1.description)
        p1.user.add(u1)
        self.assertGreaterEqual(p1.user.get(pk=u1.id).id, 1)

        p2 = Post.objects.create(
            title=title2, post_type=post_type2, description=description, job=j1
        )
        self.assertGreaterEqual(p2.job_id, 1)
        self.assertEqual(p2.id, 2)
        self.assertEqual(p2.title, "Create a simple E-Commerce Shop")
        self.assertEqual(p2.post_type, "assignment")
        self.assertIsNotNone(p2.description)
        self.assertEqual(p2.description, "lorem ipsum dolor")

        p2.user.add(u2)
        self.assertGreaterEqual(p2.user.get(pk=u2.id).id, 2)
