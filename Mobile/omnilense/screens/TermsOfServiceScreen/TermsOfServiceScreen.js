import React from 'react';
import {Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TermsOfServiceScreen = () => {
  const navigation = useNavigation();
  const backButton = () => {
    navigation.navigate('Sign Up');
  };
  return (
    <>
      <Text style={styles.container}>
        <Text style={styles.header}>Terms of Use Policy</Text>
        <Text style={styles.section}>
          Welcome to our app! This app provides a platform for users to connect
          with bars and purchase bar memberships. To use our app, you must agree
          to these terms of use.
        </Text>
        <Text style={styles.subheader}>1. User Information</Text>
        <Text style={styles.section}>
          - Our app collects information about you when you create an account,
          including your name, email address, and payment information.
          {'\n'}- We use this information to provide you with the services
          offered through our app, including the ability to purchase bar
          memberships.
          {'\n'}- We may also use your information to improve our app and
          services, and for marketing and advertising purposes.
          {'\n'}- We take your privacy seriously and will not share your
          information with third parties without your consent, except as
          required by law.
        </Text>
        <Text style={styles.subheader}>2. Bar Information</Text>
        <Text style={styles.section}>
          - Our app also collects information about bars, including their
          location, offerings, and membership information.
          {'\n'}- This information is used to provide users with information
          about bars in their area and to facilitate membership purchases.
          {'\n'}- Bar owners can access and update their information through
          their account on our app.
        </Text>
        <Text style={styles.subheader}>3. Payment Services</Text>
        <Text style={styles.section}>
          - Our app provides payment services for bar memberships.
          {'\n'}- When you make a payment, your payment information is securely
          processed by our payment processor.
          {'\n'}- We do not store your payment information on our servers.
          {'\n'}- By using our payment services, you agree to the terms and
          conditions of our payment processor.
        </Text>
        <Text style={styles.subheader}>4. User Conduct</Text>
        <Text style={styles.section}>
          - You agree to use our app only for lawful purposes.
          {'\n'}- You may not use our app to engage in any conduct that is
          harmful to us or to any other person or entity.
          {'\n'}- You are responsible for all content that you upload or share
          through our app.
        </Text>
        <Text style={styles.subheader}>5. Intellectual Property</Text>
        <Text style={styles.section}>
          - Our app and its content, including but not limited to text,
          graphics, logos, icons, and images, are the property of [Company Name]
          and are protected by intellectual property laws.
          {'\n'}- You may not use our app or its content for any commercial
          purpose without our express written consent.
        </Text>
        <Text style={styles.subheader}>6. Disclaimer of Warranties</Text>
        <Text style={styles.section}>
          - Our app is provided on an “as is” and “as available” basis.
          {'\n'}- We do not guarantee that our app will be uninterrupted or
          error-free.
          {'\n'}- You understand and agree that you use our app at your own
          risk.
        </Text>
        <Text style={styles.subheader}>7. Limitation of Liability</Text>
        <Text style={styles.section}>
          - We will not be liable for any direct, indirect, incidental, special,
          or consequential damages arising out of the use of our app.
          {'\n'}- This includes but is not limited to damages for loss of
          profits, goodwill, use, data, or other intangible losses.
        </Text>
        <Text style={styles.subheader}>8. Changes to Terms of Use</Text>
        <Text style={styles.section}>
          - We may change these terms of use from time to time.
          {'\n'}- If we make changes, we will post the new terms on our app and
          update the “last updated” date at the top of this page.
          {'\n'}- Your continued use of our app following any changes to these
          terms constitutes your acceptance of the new terms.
        </Text>
        <Text style={styles.subheader}>9. Governing Law</Text>
        <Text style={styles.section}>
          - These terms of use will be governed by and construed in accordance
          with the laws of [State/Country], without giving effect to any
          principles of conflicts of law.
        </Text>
        <Text style={styles.subheader}>10. Contact Us</Text>
        <Text style={styles.section}>
          If you have any questions or concerns about these terms of use, please
          contact us at [Contact Information].
        </Text>
      </Text>
      <Button
        title={'Return to Sign Up'}
        style={styles.button}
        onPress={() => backButton()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
  },
});

export default TermsOfServiceScreen;
